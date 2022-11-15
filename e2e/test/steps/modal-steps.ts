namespace ModalSteps {
  const { modalComponent } = inject();

  When('I dismiss the modal', () => {
    modalComponent.clickModalBackdrop();
  });
}
