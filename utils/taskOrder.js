export function calculateNewOrder(destinationItems, newIndex) {
  if (!destinationItems || destinationItems.length === 0) {
    return 1;
  } else if (newIndex === 0) {
    return destinationItems[0].order / 2;
  } else if (newIndex === destinationItems.length) {
    return destinationItems[newIndex - 1].order + 1;
  } else {
    const previousTask = destinationItems[newIndex - 1];
    const nextTask = destinationItems[newIndex];
    return (previousTask.order + nextTask.order) / 2;
  }
}

export function moveWithinContainer(sourceState, selectedTask, newIndex) {
  const currentIndex = sourceState.items.findIndex(
    (item) => item._id.toString() === selectedTask
  );

  if (currentIndex === -1) {
    return null;
  }

  const movedItem = sourceState.items.splice(currentIndex, 1)[0];
  sourceState.items.splice(newIndex, 0, movedItem);

  return sourceState.items;
}

export function updateContainerOrder(containerState) {
  containerState.items.forEach((item, index) => {
    item.order = index + 1;
  });
}
