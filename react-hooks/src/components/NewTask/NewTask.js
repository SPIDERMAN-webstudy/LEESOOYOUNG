import useHttp from "../../hooks/use-http";
import Section from "../UI/Section";
import TaskForm from "./TaskForm";

const NewTask = (props) => {
  const { isLoading, error, sendRequest: fetchTasks } = useHttp();

  const enterTaskHandler = async (taskText) => {
    const applyData = (tasksObj) => {
      const generatedId = tasksObj.name; // firebase-specific => "name" contains generated id
      const createdTask = { id: generatedId, text: taskText };

      props.onAddTask(createdTask);
    };
    fetchTasks(
      {
        url: "https://firehousoo-default-rtdb.europe-west1.firebasedatabase.app/hooks.json",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: { text: taskText },
      },
      applyData
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
