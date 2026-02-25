import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useTranslation } from 'react-i18next';
import { dismissUpload, initiateBackgroundUpload } from '../Store/Actions/UploadActions';
import { colors } from '../Assets/Styles';

const GlobalUploaderUI = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const activeUploadsMap = useSelector(state => state.uploads?.activeUploads) || {};
    const activeUploads = Object.values(activeUploadsMap);

    const hasUploads = activeUploads.length > 0;

    const { totalProgress, failedUploads, allCompleted, uploadingCount } = useMemo(() => {
        let totalP = 0;
        let failed = [];
        let completedCount = 0;
        let uploadingCount = 0;

        activeUploads.forEach(upload => {
            totalP += upload.progress || 0;
            if (upload.status === 'failed') failed.push(upload);
            else if (upload.status === 'completed') completedCount++;
            else if (upload.status === 'uploading') uploadingCount++;
        });

        const avgProgress = activeUploads.length ? Math.round(totalP / activeUploads.length) : 0;

        return {
            totalProgress: avgProgress,
            failedUploads: failed,
            allCompleted: activeUploads.length > 0 && completedCount === activeUploads.length,
            uploadingCount,
        };
    }, [activeUploads]);

    // Auto dismiss completed uploads
    useEffect(() => {
        if (allCompleted) {
            const timer = setTimeout(() => {
                activeUploads.forEach(upload => {
                    if (upload.status === 'completed') {
                        dispatch(dismissUpload(upload.id));
                    }
                });
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [allCompleted, activeUploads, dispatch]);

    if (!hasUploads) {
        return null;
    }

    const handleRetryFailed = () => {
        failedUploads.forEach(upload => {
            // Re-initiate failed upload
            // Note: progress goes back to 0, status changes back to uploading
            dispatch(initiateBackgroundUpload({
                id: upload.id,
                localUri: upload.localUri,
                uploadParams: upload.uploadParams,
            }));
        });
    };

    const handleDismissFailed = () => {
        failedUploads.forEach(upload => {
            dispatch(dismissUpload(upload.id));
        });
    };

    const hasFailed = failedUploads.length > 0;

    return (
        <View style={styles.container}>
            {hasFailed ? (
                <View style={[styles.pill, styles.errorPill]}>
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>
                            {failedUploads.length} {failedUploads.length > 1 ? t('common.uploadsFailed') : t('common.uploadFailed')}
                        </Text>
                        <TouchableOpacity onPress={handleRetryFailed} style={styles.actionButton}>
                            <Text style={styles.actionText}>{t('common.retry')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleDismissFailed} style={[styles.actionButton, styles.dismissButton]}>
                            <Text style={styles.actionText}>{t('common.dismiss')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            ) : allCompleted ? (
                <View style={[styles.pill, styles.successPill]}>
                    <Text style={styles.titleText}>{t('common.uploadComplete')}</Text>
                </View>
            ) : (
                <View style={styles.pill}>
                    <ActivityIndicator size="small" color={colors.white} style={styles.loader} />
                    <View style={styles.textContainer}>
                        <Text style={styles.titleText}>
                            {uploadingCount > 1
                                ? t('common.uploadingImages', { count: uploadingCount })
                                : t('common.uploadingImage')}
                        </Text>
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: `${totalProgress}%` }]} />
                        </View>
                        <Text style={styles.progressText}>{totalProgress}%</Text>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: hp('6%'),
        left: wp('5%'),
        right: wp('5%'),
        zIndex: 9999, // ensures it sits above Navigation headers
        alignItems: 'center',
        backgroundColor: 'black',
        borderRadius: 15
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        paddingHorizontal: wp('4%'),
        paddingVertical: hp('1.5%'),
        borderRadius: wp('10%'),
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    errorPill: {
        backgroundColor: colors.alert_red,
    },
    successPill: {
        backgroundColor: colors.green,
        justifyContent: 'center',
    },
    loader: {
        marginRight: wp('3%'),
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    titleText: {
        color: colors.white,
        fontSize: wp('3.5%'),
        fontWeight: '600',
    },
    progressBarContainer: {
        flex: 1,
        height: hp('0.5%'),
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: hp('0.25%'),
        marginHorizontal: wp('3%'),
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: colors.white,
        borderRadius: hp('0.25%'),
    },
    progressText: {
        color: colors.white,
        fontSize: wp('3%'),
        fontWeight: '600',
    },
    actionButton: {
        paddingHorizontal: wp('2%'),
        paddingVertical: hp('0.5%'),
        marginLeft: wp('2%'),
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: wp('2%'),
    },
    dismissButton: {
        backgroundColor: 'transparent',
    },
    actionText: {
        color: colors.white,
        fontSize: wp('3%'),
        fontWeight: '600',
    }
});

export default GlobalUploaderUI;
