import { useDispatch} from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteSessionThunk } from "../../../store/sessions";
import { useHistory } from "react-router-dom";
import './DeleteSessionModal.css'

function DeleteSessionModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();


    const handleDelete = async (e) => {
        e.preventDefault();

        await dispatch(deleteSessionThunk(id))
        .then(closeModal())
        history.push(`/user/dashboard`);
    }

    return (
        <div className="modal2">
          <h1 className="form-header">Confirm Delete</h1>
          <label>Are you sure you want to delete this Session?</label>
          <button className="delete2" onClick={handleDelete}>
            Yes (Delete Session)
          </button>
          <button className="modal-button2" onClick={closeModal}>
            No (Keep Session)
          </button>
          <form></form>
        </div>
      );
    }

export default DeleteSessionModal
