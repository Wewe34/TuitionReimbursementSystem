import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { ReimbursmentRequestState } from "../store/reducer/reducer";

const Success = () => {
    const history = useHistory();
    return (
        <div>
           <h3>Successful.</h3>
            <p>Redirecting to Homepage....</p>
            {setTimeout(() => {
                history.push('/Home')
            }, 2000)}
        </div>
    )
}

export default Success;