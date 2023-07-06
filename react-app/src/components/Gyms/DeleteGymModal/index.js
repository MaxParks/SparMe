import { useDispatch} from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteGymThunk } from "../../../store/gyms";
import { useHistory } from "react-router-dom";
// import './index.css'

function DeleteGymModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();


    const handleDelete = async (e) => {
        e.preventDefault();

        await dispatch(deleteGymThunk(id))
        .then(closeModal())
        history.push(`/gyms`);
    }

    return (
        <div className="modal2">
          <h1 className="form-header">Confirm Delete</h1>
          <label>Are you sure you want to delete this Gym?</label>
          <button className="delete2" onClick={handleDelete}>
            Yes (Delete Gym)
          </button>
          <button className="modal-button2" onClick={closeModal}>
            No (Keep Gym)
          </button>
          <form></form>
        </div>
      );
    }

export default DeleteGymModal
