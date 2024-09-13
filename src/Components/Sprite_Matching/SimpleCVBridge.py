import cv2
import numpy as np
from tensorflow.keras.applications import VGG16
from tensorflow.keras.preprocessing import image
from tensorflow.keras.applications.vgg16 import preprocess_input

class SimpleCVBridge:
    def __init__(self):
        self.orb = cv2.ORB_create()
        self.model = VGG16(weights='imagenet', include_top=False, pooling='avg')

    def extract_features(self, img):
        img = cv2.resize(img, (224, 224))
        img = image.img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img = preprocess_input(img)
        return self.model.predict(img)

    def match_features(self, sprite_features, frame_features):
        similarity = np.dot(sprite_features, frame_features.T)
        return similarity

    def overlay_image_alpha(self, img, img_overlay, pos, alpha_mask):
        x, y = pos
        y1, y2 = max(0, y), min(img.shape[0], y + img_overlay.shape[0])
        x1, x2 = max(0, x), min(img.shape[1], x + img_overlay.shape[1])
        y1o, y2o = max(0, -y), min(img_overlay.shape[0], img.shape[0] - y)
        x1o, x2o = max(0, -x), min(img_overlay.shape[1], img.shape[1] - x)
        if y1 >= y2 or x1 >= x2 or y1o >= y2o or x1o >= x2o:
            return
        alpha = alpha_mask[y1o:y2o, x1o:x2o, None]
        img[y1:y2, x1:x2] = alpha * img_overlay[y1o:y2o, x1o:x2o, :3] + (1.0 - alpha) * img[y1:y2, x1:x2]

    def match_template_pyramid(self, frame, template):
        scales = [1.0, 0.9, 0.8, 0.7, 0.6, 0.5]
        max_match_val = -1
        match_location = None
        match_scale = 1.0

        for scale in scales:
            resized_frame = cv2.resize(frame, (0, 0), fx=scale, fy=scale)
            if resized_frame.shape[0] < template.shape[0] or resized_frame.shape[1] < template.shape[1]:
                continue  # Skip this scale if the frame is smaller than the template

            result = cv2.matchTemplate(resized_frame, template, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(result)

            if max_val > max_match_val:
                max_match_val = max_val
                match_location = max_loc
                match_scale = scale

        return max_match_val, match_location

    def load_sprite(self, filename):
        sprite = cv2.imread(filename, cv2.IMREAD_UNCHANGED)
        sprite_color = sprite[:, :, :3]
        sprite_alpha = sprite[:, :, 3] / 255.0
        sprite_gray = cv2.cvtColor(sprite_color, cv2.COLOR_BGR2GRAY)
        sprite_edges = cv2.Canny(sprite_gray, 50, 200)
        return sprite_color, sprite_alpha, sprite_edges

    def process_frame(self, frame, sprite_color, sprite_alpha, sprite_edges):
        frame_height, frame_width = frame.shape[:2]
        sprite_height, sprite_width = sprite_color.shape[:2]

        if sprite_height > frame_height or sprite_width > frame_width:
            scale_factor = min(frame_width / sprite_width, frame_height / sprite_height)
            sprite_color = cv2.resize(sprite_color, (0, 0), fx=scale_factor, fy=scale_factor)
            sprite_alpha = cv2.resize(sprite_alpha, (0, 0), fx=scale_factor, fy=scale_factor)
            sprite_edges = cv2.resize(sprite_edges, (0, 0), fx=scale_factor, fy=scale_factor)
            sprite_height, sprite_width = sprite_color.shape[:2]

        frame_gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        frame_edges = cv2.Canny(frame_gray, 50, 200)

        max_match_val, match_location = self.match_template_pyramid(frame_edges, sprite_edges)

        threshold = 0.07
        if max_match_val >= threshold:
            x = (frame_width - sprite_width) // 2
            y = (frame_height - sprite_height) // 2
            self.overlay_image_alpha(frame, sprite_color, (x, y), sprite_alpha)
            cv2.putText(frame, "Object matched, capture the image", (10, 30), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2, cv2.LINE_AA)
        else:
            detection_counter = 0

        return frame