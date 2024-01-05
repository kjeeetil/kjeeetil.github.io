function postComment() {
    const commentInput = document.getElementById('comment-input');
    const commentText = commentInput.value.trim();
    if (commentText) {
        const commentsDiv = document.getElementById('comments');
        const newCommentDiv = document.createElement('div');
        newCommentDiv.classList.add('comment');
        newCommentDiv.textContent = commentText;
        commentsDiv.appendChild(newCommentDiv);
        commentInput.value = ''; // Clear the input field
    }
}
