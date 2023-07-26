import { useDispatch} from "react-redux";
import { useModal } from "../../../context/Modal";
import { deleteReviewThunk } from "../../../store/reviews";
import { useHistory } from "react-router-dom";

function DeleteReviewModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const history = useHistory();


    const handleDelete = async (e) => {
        e.preventDefault();

        await dispatch(deleteReviewThunk(id))
        .then(closeModal())
        history.push(`/reviews`);
    }

    return (
        <div className="modal2">
          <h1 className="form-header">Confirm Delete</h1>
          <label>Are you sure you want to delete this Review?</label>
          <button className="delete2" onClick={handleDelete}>
            Yes (Delete Review)
          </button>
          <button className="modal-button2" onClick={closeModal}>
            No (Keep Review)
          </button>
          <form></form>
        </div>
      );
    }

export default DeleteReviewModal
