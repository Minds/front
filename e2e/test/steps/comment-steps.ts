namespace CommentSteps {
  const { activityComponent } = inject();

  When(
    'I enter {string} in the comment poster input',
    (commentText: string = 'foo') => {
      activityComponent.enterTextInCommentPoster(commentText);
    }
  );
}
