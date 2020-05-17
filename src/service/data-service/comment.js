'use strict';

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {

  create(article, commentData) {
    const newComment = Object.assign(
        {
          id: nanoid(MAX_ID_LENGTH)
        },
        commentData
    );

    article.comments.push(newComment);

    return newComment;
  }

  delete(commentId, article) {
    const deletedComment = article.comments.find((comment) => comment.id === commentId);

    if (!deletedComment) {
      return null;
    }

    article.comments = article.comments.filter((comment) => comment.id !== commentId);
    return deletedComment;
  }

  findAll(article) {
    return article.comments;
  }

}


module.exports = CommentService;
