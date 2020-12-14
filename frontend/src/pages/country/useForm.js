import {useState, useEffect} from 'react';

const useForm = (callback, validate) => {

    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {

        if (Object.keys(errors).length === 0 && isSubmitting) {
            callback();
            setValues({});
        }
    }, [errors]);

    const handleSubmit = (event) => {
        if (event) event.preventDefault();
        setIsSubmitting(true);
        setErrors(validate(values));

    };

    const handleChange = (event) => {
        event.persist();
        setValues(values => ({ ...values, [event.target.name]: event.target.value}));
    };

    return {
        handleChange,
        handleSubmit,
        values,
        errors,
    }
};

export default useForm;