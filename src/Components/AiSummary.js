import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {colors} from '../Assets/Styles';

const {black, slateGray, royalBlue} = colors;

const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const BULLET_PATTERN = /^[-*•]\s+(.*)$/;
const BOLD_PATTERN = /(\*\*.+?\*\*)/g;

const isBold = chunk => chunk.length > 4 && chunk.startsWith('**') && chunk.endsWith('**');

// The AI summary arrives as a small markdown subset: `### headings`, `- bullets`,
// paragraphs and `**bold**` spans. Parsed here so we do not pull in a markdown renderer.
const parseSummary = summary => {
  if (typeof summary !== 'string') {
    return [];
  }
  return summary
    .replace(/\r\n/g, '\n')
    .split('\n')
    .reduce((blocks, rawLine) => {
      const line = rawLine.trim();
      if (!line) {
        return blocks;
      }
      const heading = line.match(HEADING_PATTERN);
      if (heading) {
        blocks.push({type: 'heading', text: heading[2]});
        return blocks;
      }
      const bullet = line.match(BULLET_PATTERN);
      if (bullet) {
        blocks.push({type: 'bullet', text: bullet[1]});
        return blocks;
      }
      blocks.push({type: 'paragraph', text: line});
      return blocks;
    }, []);
};

const renderInline = text =>
  text
    .split(BOLD_PATTERN)
    .filter(chunk => chunk !== '')
    .map((chunk, index) =>
      isBold(chunk) ? (
        <Text key={`bold-${index}`} style={styles.bold}>
          {chunk.slice(2, -2)}
        </Text>
      ) : (
        chunk
      ),
    );

const AiSummary = ({summary}) => {
  const blocks = useMemo(() => parseSummary(summary), [summary]);

  if (!blocks.length) {
    return null;
  }

  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      return (
        <Text key={`heading-${index}`} style={styles.heading}>
          {block.text}
        </Text>
      );
    }
    if (block.type === 'bullet') {
      return (
        <View key={`bullet-${index}`} style={styles.bulletRow}>
          <Text style={styles.bulletDot}>{'•'}</Text>
          <Text style={styles.bulletText}>{renderInline(block.text)}</Text>
        </View>
      );
    }
    return (
      <Text key={`paragraph-${index}`} style={styles.paragraph}>
        {renderInline(block.text)}
      </Text>
    );
  });
};

const styles = StyleSheet.create({
  heading: {
    fontSize: hp('1.9%'),
    fontWeight: 'bold',
    color: royalBlue,
    marginTop: hp('1.5%'),
    marginBottom: hp('0.5%'),
  },
  paragraph: {
    fontSize: hp('1.8%'),
    lineHeight: hp('2.6%'),
    color: black,
  },
  bulletRow: {
    flexDirection: 'row',
    marginTop: hp('0.5%'),
  },
  bulletDot: {
    fontSize: hp('1.8%'),
    lineHeight: hp('2.6%'),
    color: slateGray,
    marginRight: '2%',
  },
  bulletText: {
    flex: 1,
    fontSize: hp('1.8%'),
    lineHeight: hp('2.6%'),
    color: slateGray,
  },
  bold: {
    fontWeight: 'bold',
    color: black,
  },
});

export default AiSummary;
