import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Shimmer.module.css"; // Import the shimmer CSS module
import Modal from "./components/Modal";
import Card from "./components/Card";
import { useIndustries } from "./hooks/useIndustries";

export default function Home() {
  const [greeting, setGreeting] = useState("");
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [prompt, setPrompt] = useState("");

  const { data: industries, isLoading, error } = useIndustries();

  useEffect(() => {
    const hours = new Date().getHours();
    let greet = "Hello";
    if (hours < 12) greet = "Morning";
    else if (hours < 18) greet = "Afternoon";
    else greet = "Evening";

    setGreeting(greet);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Check if user data is in local storage
      // const storedUserData = localStorage.getItem("userData");
      // if (storedUserData) {
      //   setUserData(JSON.parse(storedUserData));
      // } else {
      const data = await getUserData();
      setUserData(data);
      // Save user data in local storage
      localStorage.setItem("userData", JSON.stringify(data));
      // }
    };

    fetchData();
  }, []);

  const getUserData = async () => {
    const key = await new Promise((resolve) => {
      window.parent.postMessage({ message: "REQUEST_USER_DATA" }, "*");
      window.addEventListener("message", ({ data }) => {
        if (data.message === "REQUEST_USER_DATA_RESPONSE") {
          resolve(data.payload);
        }
      });
    });

    const res = await fetch("http://localhost:3001/api/v1/auth/decrypt-sso", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key }),
    });

    const data = await res.json();
    return data;
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen flex-col justify-between p-4">
        <header className="bg-[#A7CCFE] rounded-lg p-10 flex flex-col gap-6">
          <div>
            <h1>Logo</h1>
          </div>
          <div className={styles.shimmerWrapper}>
            <div
              className={styles.shimmer}
              style={{ width: "200px", height: "48px" }}
            ></div>
            <div
              className={styles.shimmer}
              style={{ width: "300px", height: "20px", marginTop: "10px" }}
            ></div>
          </div>
        </header>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col justify-between p-4">
        <header className="bg-[#A7CCFE] rounded-lg p-10 flex flex-col gap-6">
          <div>
            <h1>Logo</h1>
          </div>
          <p>Error loading industries. Please try again later.</p>
        </header>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col justify-between p-4">
      <header className="bg-[#A7CCFE] rounded-lg p-10 flex flex-col gap-6">
        <div>
          <h1>Logo</h1>
        </div>
        <div>
          <h2 className="text-[48px]">{`${greeting}, ${
            userData?.userName.split(" ")[0] || "User"
          }`}</h2>
          <p className="text-[#00000054]">
            It will help you to create AI Employee
          </p>
        </div>
        <div className="bg-[#D7E0FF] w-[max-content] p-10 rounded-2xl flex gap-4">
          <button className="bg-[#000002] text-[#fff] py-2 px-4 rounded-lg">
            Create AI Employee
          </button>
          <button className="bg-[#A7CCFE] py-2 px-4 rounded-lg">
            Custom Build Employee
          </button>
        </div>
      </header>
      <section className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">All Industries</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {industries.map((industry, index) => (
            <Card
              onClick={() => {
                setShowModal(true);
                setQuestions([...industry.questions]);
                setPrompt(industry.openAiPrompt);
              }}
              key={industry._id}
              name={industry.industryName}
              industry={industry.industryName}
              expertise={"Ai Agent"}
              prompt={industry.openAiPrompt}
            />
          ))}
        </div>
      </section>
      <Modal
        show={showModal}
        questions={questions}
        prompt={prompt}
        onClose={() => setShowModal(false)}
      />
    </main>
  );
}
