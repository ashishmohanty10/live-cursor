import { useEffect, useRef } from "react";
import useWebSocket from "react-use-websocket";
import throttle from "lodash.throttle";
import { Cursor } from "./components/cursor";

interface UserProps {
  username: string;
  state: {
    x: number;
    y: number;
  };
}

const renderCursor = (users: Record<string, UserProps>) => {
  return Object.keys(users).map((uuid) => {
    const user = users[uuid];

    return <Cursor key={uuid} point={[user.state.x, user.state.y]} />;
  });
};

const renderUserList = (users: Record<string, UserProps>) => {
  return (
    <ul>
      {Object.keys(users).map((uuid) => {
        return <li key={uuid}>{JSON.stringify(users[uuid])}</li>;
      })}
    </ul>
  );
};

export default function Home({ username }: { username: string }) {
  const wsURL = import.meta.env.VITE_WS_URL;

  const { sendJsonMessage, lastJsonMessage } = useWebSocket(wsURL, {
    queryParams: { username },
  });

  const THROTTLE = 50;
  const sendJsonMessageThrolled = useRef(throttle(sendJsonMessage, THROTTLE));

  useEffect(() => {
    sendJsonMessage({
      x: 0,
      y: 0,
    });

    window.addEventListener("mousemove", (e) => {
      sendJsonMessageThrolled.current({
        x: e.clientX,
        y: e.clientY,
      });
    });
  }, [sendJsonMessage]);

  if (lastJsonMessage) {
    const users = lastJsonMessage as Record<string, UserProps>;

    return (
      <div>
        {renderCursor(users)}
        {renderUserList(users)}
      </div>
    );
  }
  return <h1>hello {username}</h1>;
}
