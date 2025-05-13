import "./Feedback.css"
import FeedbackForm from "../components/FeedbackForm"

const Feedback = () => {
    return (
        <div className="feedback">
          <header>
            <h1>Обратная связь</h1>
          </header>
          <main>
            <FeedbackForm />
          </main>
        </div>
      );
}
export default Feedback;