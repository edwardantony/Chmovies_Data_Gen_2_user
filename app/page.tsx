"use client";

import { useState, useEffect } from "react";
//import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import "./../app/app.css";
//import { handleSubscriptionLifecycle } from "@/amplify/functions/UserSubscriptions/handleSubscriptionLifecycle/resource";

import { generateClient } from 'aws-amplify/api';

Amplify.configure(outputs);

const client = generateClient<Schema>();

function AppContent() {
  const [users, setUsers] = useState<Array<Schema["Users"]["type"]>>([]);

  function listTodos() {
    client.models.Users.observeQuery().subscribe({
      next: (data) => setUsers([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    const username = window.prompt("Add username");
    const cognitoId = window.prompt("cognitoId Year");
    const email = window.prompt("Add email");
  
    if (!username || !cognitoId || !email) return;
  
    client.models.Users.create({
      username,
      cognitoId,
      email,
    } as any);
  }


  console.log("QUERY: ", client);


  return (
    <main>
      <h1>Create New User</h1>
      <button onClick={createTodo}>+ new</button>
      
      <ul>
        {users.map((user) => (
          <li key={user?.id}>{user?.username} ------ {user?.cognitoId} ------ {user?.email}</li>
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