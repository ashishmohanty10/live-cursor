import { FormEvent, useState } from "react";

interface LoginProps {
  onSubmit: React.Dispatch<React.SetStateAction<string>>;
}

export function Login({ onSubmit }: LoginProps) {
  const [username, setUsername] = useState("");

  return (
    <>
      <h1>Welcome</h1>
      <p>Please specify your nickname</p>

      <form
        onSubmit={(e: FormEvent) => {
          e.preventDefault();

          onSubmit(username);
        }}
      >
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button type="submit">Submit</button>
      </form>
    </>
  );
}
