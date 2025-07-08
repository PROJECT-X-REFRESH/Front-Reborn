import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { fetchComments, createComment, deleteComment } from '../../../services/boardapi';

export const useComments = (boardId) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    const loadComments = async () => {
        try {
            const commentData = await fetchComments(boardId);
            setComments(commentData.map(c => ({
                id: String(c.id),
                user: c.commentWriter,
                time: c.createdAt.substring(0, 16).replace('T', ' '),
                text: c.contents,
                profileImage: c.writerProfileImage,
            })));
        } catch {
            Alert.alert('오류', '댓글을 불러오는 중 문제가 발생했습니다.');
        }
    };

    useEffect(() => {
        if (boardId) loadComments();
    }, [boardId]);

    const handleCreateComment = async () => {
        if (!newComment.trim()) return;
        try {
            await createComment(boardId, newComment.trim());
            setNewComment('');
            await loadComments();
        } catch {
            Alert.alert('오류', '댓글 작성에 실패했습니다.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch {
            Alert.alert('권한 없음', '댓글 삭제는 작성자만 가능합니다.');
        }
    };

    return {
        comments,
        newComment,
        setNewComment,
        handleCreateComment,
        handleDeleteComment,
    };
};
