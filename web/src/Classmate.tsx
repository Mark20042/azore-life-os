import { useState } from "react";
import { Button, Input, Card } from "@heroui/react";

type Classmate = {
  name: string;
};

const Classmate = () => {
  const [classmates, setClassmates] = useState<Classmate[]>([]);
  const [name, setName] = useState<string>("");

  const inputNameChange = () => (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const addClassmate = () => {
    if (name.trim() === "") return;
    setClassmates([...classmates, { name: name }]);
    setName("");
  };

  const removeClassmate = (index: number) => {
    setClassmates(classmates.filter((_, i) => i !== index));
  };

  const updateClassmate = (index: number, newName: string) => {
    setClassmates(
      classmates.map((classmate, i) =>
        i === index ? { ...classmate, name: newName } : classmate,
      ),
    );
  };

  const handleUpdate = (index: number) => {
    const newName = prompt("Enter new name");
    if (newName?.trim() === "") return;
    if (newName) {
      updateClassmate(index, newName);
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Mga Classmate Nimo{" "}
      </h2>

      <div className="flex items-end gap-3 w-1/2 mb-8">
        <Input
          placeholder="Name sa Classmate"
          value={name}
          onChange={inputNameChange()}
        />
        <Button size="lg" onClick={addClassmate} className="h-10">
          Add
        </Button>
      </div>

      <ul className="flex flex-col gap-3">
        {classmates.map((classmate, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all border border-transparent hover:border-gray-200"
          >
            <span className="text-gray-700 font-medium">{classmate.name}</span>
            <Button
              size="sm"
              variant="tertiary"
              onClick={() => handleUpdate(index)}
            >
              Update
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => removeClassmate(index)}
            >
              Remove
            </Button>
          </li>
        ))}
      </ul>

      {classmates.length === 0 && (
        <p className="text-center text-gray-400 mt-6 text-sm italic">
          No classmates yet
        </p>
      )}
    </Card>
  );
};

export default Classmate;
