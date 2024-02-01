import { useCalendarStore, useUiStore } from "../../hooks";

export const FabDelete = () => {
  const { startDeletingEvent, hasEventSelected } = useCalendarStore();
  const { isDateModalOpen } = useUiStore();

  const handleClick = () => {
    startDeletingEvent()
  }

  return (
    <button 
      className="btn btn-danger fab-danger" 
      onClick={handleClick}
      style={{
        display: (hasEventSelected && !isDateModalOpen) ? '' : 'none'
      }}  
    >
      <i className="fas fa-trash-alt"></i>
    </button>
  );
};
