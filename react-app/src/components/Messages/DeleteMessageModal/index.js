import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteMessageThunk } from "../../../store/messages";

function DeleteMessageModal({ id, onSuccessfulDelete }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleDelete = async (e) => {
        e.preventDefault();

        await dispatch(deleteMessageThunk(id));
        if (onSuccessfulDelete) {
            onSuccessfulDelete();
        }
        closeModal();
    }

    return (
        <div className="modal2">
            <h1 className="form-header">Confirm Delete</h1>
            <label>Are you sure you want to delete this Message?</label>
            <button className="delete2" onClick={handleDelete}>
                Yes (Delete Message)
            </button>
            <button className="modal-button2" onClick={closeModal}>
                No (Keep Message)
            </button>
            <form></form>
        </div>
    );
}

export default DeleteMessageModal;
