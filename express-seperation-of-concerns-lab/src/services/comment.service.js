// src/services/comments.service.js

let comments = [
{"id": 1, "comment": "This is the first comment"},
  {"id": 2, "comment": "This is the second comment"},
    {"id": 3, "comment": "This is the third comment"}
];
let nextId = 4;

export const getAllcomments = () => {
    return comments;
};

export const getcommentsById = (id) => {
    return comments.find(p => p.id === id);
};

export const createcomments = (commentsData) => {
    const newcomments = { id: nextId++, ...commentsData };
    comments.push(newcomments);
    return newcomments;
};

export const updatecomments = (id, commentsData) => {
    const commentsIndex = comments.findIndex(p => p.id === id);
    if (commentsIndex === -1) {
        return null;
    }
    comments[commentsIndex] = { ...comments[commentsIndex], ...commentsData };
    return comments[commentsIndex];
};

export const deletecomments = (id) => {
    const commentsIndex = comments.findIndex(p => p.id === id);
    if (commentsIndex === -1) {
        return false;
    }
    comments.splice(commentsIndex, 1);
    return true;
};

export const patchcomments = (id, commentsData) => {
    const commentsIndex = comments.findIndex(p => p.id === id);
    if (commentsIndex === -1) {
        return null;
    }  
    comments[commentsIndex] = { ...comments[commentsIndex], ...commentsData };
    return comments[commentsIndex];
};