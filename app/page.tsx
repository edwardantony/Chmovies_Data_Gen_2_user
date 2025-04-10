"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./../app/app.css";

Amplify.configure(outputs);

const client = generateClient<Schema>();

function AppContent() {
  const [contents, setContents] = useState<Array<Schema["Titles"]["type"]>>([]);

  function listTodos() {
    client.models.Titles.observeQuery().subscribe({
      next: (data) => setContents([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const titleName = window.prompt("Add Title");
    const releaseYear = window.prompt("Release Year");
    const sortOrder = parseInt(window.prompt("Add Sort Order") || "9");
  
    if (!titleName || !releaseYear || isNaN(sortOrder)) return;
  
    client.models.Titles.create({
      titleName,
      releaseYear,
      sortOrder,
    } as any);
  }
  

  return (
    <main>
      <h1>Create New Titles</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {contents.map((content) => (
          <li key={content.id}>{content.titleName} ------ {content.releaseYear} ------ {content.sortOrder}</li>
        ))}
      </ul>
    </main>
  );
}

export default function App() {
  return (
    <Authenticator
      loginMechanisms={['email', 'phone_number']}
      signUpAttributes={['email', 'phone_number']}
    >
      {({ signOut, user }) => (
        <div>
          <header>
            <h2>Welcome {user?.username}</h2>
            <button onClick={signOut}>Sign out</button>
          </header>
          <AppContent />
        </div>
      )}
    </Authenticator>
  );
}