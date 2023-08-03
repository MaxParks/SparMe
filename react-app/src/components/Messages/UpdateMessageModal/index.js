import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateMessageThunk } from '../../../store/messages';
import { useModal } from '../../../context/Modal';

const UpdateMessageModal = ({ messageId, messageContent, onSuccessfulUpdate}) => {
    const dispatch = useDispatch();
    const { closeModal } = useModal();
    const [content, setContent] = useState(messageContent);
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};
        if (!content) {
            errors.content = "Content is a required field.";
        }

        if (Object.keys(errors).length > 0) {
            setErrors(errors);
            return;
        }

        const data = await dispatch(updateMessageThunk(messageId, { message_text: content }));

        if (Array.isArray(data)) {
            setErrors({ general: data });
        } else if (data && data.id) {
            setContent("");
            if (onSuccessfulUpdate) {
              onSuccessfulUpdate();
              closeModal();
          }
        }
    };

    return (
        <div className="update-message-container">
            <form onSubmit={handleSubmit}>
                <ul className="error-list">
                    {errors.content && <li>{errors.content}</li>}
                    {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
                </ul>
                <div className="form-field">
                    <textarea
                        id="content"
                        name="content"
                        placeholder="Message..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <div className="button-container1">
                    <button type="submit">Update</button>
                </div>
            </form>
        </div>
    );
};

export default UpdateMessageModal;
