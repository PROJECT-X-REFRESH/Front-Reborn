// hooks/useBoardDetail.js
import { useEffect, useState } from 'react';
import { Alert, Dimensions } from 'react-native';
import config from '../../../constants/config';
import { fetchBoardDetail, toggleBoardLike } from '../../../services/boardapi';
import { put } from '../../../services/api';

const { width } = Dimensions.get('window');

export const useBoardDetail = (boardId, category) => {
    const [loading, setLoading] = useState(true);
    const [writer, setWriter] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [content, setContent] = useState('');
    const [editedContent, setEditedContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [boardImage, setBoardImage] = useState(null);
    const [imageHeight, setImageHeight] = useState(width * 0.88);
    const [liked, setLiked] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                const detail = await fetchBoardDetail(boardId);
                const formattedTime = detail.createdAt?.substring(0, 16).replace('T', ' ') || '';

                setWriter(detail.writerName);
                setCreatedAt(formattedTime);
                setContent(detail.content);
                setEditedContent(detail.content);
                setLiked(detail.like);
                setBoardImage(detail.attachImg || null);
                setProfileImage(detail.writerProfileImage || null);

                if (detail.attachImg) {
                    const { Image } = require('react-native');
                    Image.getSize(
                        detail.attachImg,
                        (imgWidth, imgHeight) => {
                            const aspectRatio = imgHeight / imgWidth;
                            const calculatedHeight = (width * 0.88) * aspectRatio;
                            setImageHeight(Math.min(calculatedHeight, width * 0.88));
                        },
                        () => setImageHeight(width * 0.88)
                    );
                }
            } catch (error) {
                Alert.alert('오류', '게시글을 불러오는 중 문제가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        loadDetail();
    }, [boardId]);

    const handleEdit = async () => {
        try {
            await put(config.BOARD.UPDATE(boardId), {
                category,
                content: editedContent,
            });
            setContent(editedContent);
            setIsEditing(false);
        } catch {
            Alert.alert('권한 없음', '게시글 수정은 작성자만 가능합니다.');
        }
    };

    const handleToggleLike = async () => {
        try {
            await toggleBoardLike(boardId);
            setLiked(prev => !prev);
        } catch {
            Alert.alert('오류', '좋아요 처리에 실패했습니다.');
        }
    };

    return {
        loading,
        writer,
        createdAt,
        content,
        editedContent,
        setEditedContent,
        isEditing,
        setIsEditing,
        profileImage,
        boardImage,
        imageHeight,
        liked,
        menuVisible,
        setMenuVisible,
        handleEdit,
        handleToggleLike,
    };
};
