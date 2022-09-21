const populateAuthor = (userFields: string) => [
  { path: 'author', select: userFields },
];

export default populateAuthor;
