import React, { useEffect, useRef } from "react";
import Input from "./Input";

export default function App({ msg }) {
  const [isTrue, setIsTrue] = React.useState(false);
  const [crowd, setCrowd] = React.useState([]);
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [dob, setDob] = React.useState("");

  //usefef

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const dobRef = useRef(null);

  const toggleTrue = () => {
    if (isTrue) {
      setIsTrue(false);
      return;
    }
    setIsTrue(true);
  };

  useEffect(() => {
    let people = [
      {
        id: 1,
        firstName: "Mary",
        lastName: "Jones",
        dob: "1997-05-02",
      },
      {
        id: 2,
        firstName: "Jack",
        lastName: "Smith",
        dob: "1999-02-04",
      },
    ];
    setCrowd(people);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!firstName || !lastName || !dob) {
      return;
    }
    addPerson(firstName, lastName, dob);
  };

  const addPerson = (newFirstName, newLastName, newDob) => {
    let newPerson = {
      id: crowd.length + 1,
      firstName: newFirstName,
      lastName: newLastName,
      dob: newDob,
    };
    const newCrowd = crowd.concat(newPerson);

    const sorted = newCrowd.sort((a, b) => {
      if (a.lastName < b.lastName) {
        return -1;
      } else if (a.lastName > b.lastName) {
        return 1;
      } else {
        return 0;
      }
    });
    setCrowd(sorted);

    setFirstName("");
    setLastName("");
    setDob("");

    firstNameRef.current.value = "";
    lastNameRef.current.value = "";
    dobRef.current.value = "";
  };
  return (
    <>
      <hr />
      <h1>{msg}</h1>
      {isTrue && (
        <>
          <p>The current value of isTrue is true</p>
          <hr />
        </>
      )}
      <hr />
      {isTrue ? <p>Is true</p> : <p>Is false</p>}

      <button className="btn btn-primary" onClick={toggleTrue}>
        Toggle isTrue
      </button>

      <hr />

      <form autoComplete="off" onSubmit={handleSubmit}>
        <Input
          type="text"
          name="firstName"
          title="First Name"
          ref={firstNameRef}
          className="form-control"
          autoComplete="firstnamenew"
          onChange={(e) => setFirstName(e.target.value)}
        />
        <Input
          type="text"
          name="lastName"
          title="Last Name"
          ref={lastNameRef}
          className="form-control"
          autoComplete="lastnamenew"
          onChange={(e) => setLastName(e.target.value)}
        />
        <Input
          type="date"
          name="dob"
          ref={dobRef}
          title="Date of Birth"
          className="form-control"
          autoComplete="dobnew"
          onChange={(e) => setDob(e.target.value)}
        />

        <input type="submit" value="Submit" className="btn btn-primary"></input>
      </form>

      <hr />
      <div>
        First Name: {firstName}
        <br />
        Last Name: {lastName}
        <br />
        DOB: {dob}
        <br />
      </div>

      <hr />
      <h3>People</h3>
      <ul className="list-group">
        {crowd.map((m) => (
          <li key={m.id} className="list-group-item">
            {m.firstName} {m.lastName}
          </li>
        ))}
      </ul>
    </>
  );
}
