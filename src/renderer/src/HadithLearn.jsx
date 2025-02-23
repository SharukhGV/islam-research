import React, { useState, useMemo, useCallback } from "react";
import { Virtuoso } from "react-virtuoso";

// Lazy load the JSON files
const hadithBooks = [
  { name: "Abu Dawud", data: () => import("./abudawud.json") },
  { name: "Ahmed", data: () => import("./ahmed.json") },
  { name: "Bukhari", data: () => import("./bukhari.json") },
  { name: "Darimi", data: () => import("./darimi.json") },
  { name: "Malik", data: () => import("./malik.json") },
  { name: "Muslim", data: () => import("./muslim.json") },
  { name: "Nasai", data: () => import("./nasai.json") },
  { name: "Tirmidhi", data: () => import("./tirmidhi.json") },
  { name: "Ibn Majah", data: () => import("./ibnmajah.json") },
  { name: "Aladab Almufrad", data: () => import("./aladab_almufrad.json") },
  { name: "Bulugh Almaram", data: () => import("./bulugh_almaram.json") },
  { name: "Mishkat Almasabih", data: () => import("./mishkat_almasabih.json") },
  { name: "Riyad Assalihin", data: () => import("./riyad_assalihin.json") },
  { name: "Shamail Muhammadiyah", data: () => import("./shamail_muhammadiyah.json") },
  { name: "Nawawi 40", data: () => import("./nawawi40.json") },
  { name: "Qudsi 40", data: () => import("./qudsi40.json") },
  { name: "Shah Waliullah 40", data: () => import("./shahwaliullah40.json") }
];

const HadithLearn = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [searchType, setSearchType] = useState("phrase"); // 'phrase' or 'word'

  const toggleIntro = () => {
    setShowIntro(!showIntro);
  };

  // Toggle between phrase search and word search
  const toggleSearchType = () => {
    setSearchType((prev) => (prev === "phrase" ? "word" : "phrase"));
  };

  const debouncedSearch = useCallback(
    debounce(async (searchQuery) => {
      if (searchQuery.trim() === "") {
        setResults([]);
        return;
      }

      setLoading(true);
      const filteredResults = [];

      for (const book of hadithBooks) {
        const { default: data } = await book.data();
        const bookResults = data
          .filter((hadith) => {
            if (searchType === "phrase") {
              // Exact phrase search (match exact sequence)
              return (
                hadith.arabic.includes(searchQuery) ||
                hadith.english?.narrator.toLowerCase().includes(searchQuery) ||
                hadith.english?.text.toLowerCase().includes(searchQuery)
              );
            } else {
              // Word search (match words anywhere in the text, not in order)
              const words = searchQuery.split(" ").map((word) => word.trim().toLowerCase());
              return words.every((word) => {
                return (
                  hadith.arabic.toLowerCase().includes(word) ||
                  hadith.english?.narrator.toLowerCase().includes(word) ||
                  hadith.english?.text.toLowerCase().includes(word)
                );
              });
            }
          })
          .map((hadith) => ({ ...hadith, bookName: book.name }));
        filteredResults.push(...bookResults);
      }

      setResults(filteredResults);
      setLoading(false);
    }, 300),
    [searchType]
  );

  const handleSearch = (event) => {
    const searchQuery = event.target.value.toLowerCase();
    setQuery(searchQuery);
    debouncedSearch(searchQuery);
  };

  const memoizedResults = useMemo(() => results, [results]);

  return (
    <div style={{ color: "black", backgroundColor: "whitesmoke", borderStyle: "solid", padding: "10px", borderColor: "gray" }}>
      <input
        type="text"
        placeholder="Search Hadith (Arabic or English)..."
        value={query}
        onChange={handleSearch}
        style={{
          width: "95%",
          justifyContent: "center",
          padding: "10px",
          fontSize: "16px",
          marginBottom: "20px",
        }}
      />
      <div style={{ marginBottom: "20px" }}>
        <button onClick={toggleSearchType} style={{ padding: "5px 10px" }}>
          Switch to {searchType === "phrase" ? "Word" : "Exact Phrase"} Search
        </button>
      </div>

      {!query ? (
        <div className="intro-content">
          <h1>Hadith Learning</h1>
          <p>
            Explore the teachings of Prophet Muhammad (peace be upon him) through authentic Hadith collections.
            This app features a carefully curated selection of seventeen renowned Hadith books, offering invaluable
            insights into Islamic teachings and practices.
          </p>
          <h3>Included Books:</h3>
          <ol>
            <li><strong>Sahih Bukhari</strong> - One of the most trusted collections of Hadith, compiled by Imam Bukhari.</li>
            <li><strong>Sahih Muslim</strong> - Another highly regarded compilation, known for its authenticity.</li>
            <li><strong>Sunan Abu Dawood</strong> - A collection focusing on legal rulings and practices.</li>
            <li><strong>Sunan an-Nasai</strong> - Known for its rigorous methodology in selecting Hadith.</li>
            <li><strong>Jami at-Tirmidhi</strong> - Offers a blend of authentic and good Hadith, along with commentary.</li>
            <li><strong>Sunan Ibn Majah</strong> - Contains a variety of Hadith covering different aspects of life.</li>
            <li><strong>Muwatta Malik</strong> - A foundational text that combines Hadith with the practices of the people of Medina.</li>
            <li><strong>Musnad Ahmad</strong> - A comprehensive collection that includes many lesser-known narrations.</li>
            <li><strong>Riyad Us-Salihin</strong> - A selection of Hadith that emphasizes moral guidance and ethical living.</li>
            <li><strong>Al-Adab al-Mufrad</strong> - A collection by Imam Bukhari focused on the etiquettes and morality in daily life.</li>
<li><strong>Bulugh al-Maram</strong> - A collection of Hadith primarily dealing with fiqh (Islamic jurisprudence), compiled by Ibn Hajar al-Asqalani.</li>
<li><strong>Mishkat al-Masabih</strong> - A well-known compilation that gathers various Hadith covering various topics, organized by al-Tabrizi.</li>
<li><strong>Shama'il Muhammadiyah</strong> - A work that describes the physical attributes and noble character of Prophet Muhammad (PBUH), compiled by Imam at-Tirmidhi.</li>
<li><strong>Nawawi 40</strong> - A collection of 40 Hadith compiled by Imam Nawawi, focusing on key principles of Islamic practice and ethics, commonly regarded as essential for understanding the faith.</li>
<li><strong>Qudsi 40</strong> - A compilation of 40 Hadith Qudsi, in which the Prophet Muhammad (PBUH) conveys words attributed directly to Allah, focusing on divine guidance and the relationship between God and humanity.</li>
<li><strong>Shah Waliullah 40</strong> - A set of 40 Hadith compiled by Shah Waliullah, emphasizing Islamic teachings and ethical principles, with a focus on practical aspects of faith and spirituality.</li>
<li><strong>Sunan ad-Darimi</strong> - Sunan ad-Darimi is an important collection of approximately 3,400 hadith compiled by Imam Abdullah ibn Abd ar-Rahman ad-Darimi, focusing on the Sunnah of the Prophet Muhammad (ﷺ), but it has yet to be translated into English.</li>

          </ol>
          <p>
            With over 41,000 Hadith at your fingertips, this app is designed to enhance your understanding of Islam 
            and facilitate daily learning. Whether you are seeking specific teachings or exploring general topics, 
            the Hadith Search app provides a user-friendly interface to help you connect with the wisdom of the 
            Prophet (peace be upon him).
          </p>
        </div>
      ) : (
        <>
          <div>
            {loading ? (
              <p>Loading...</p>
            ) : memoizedResults.length > 0 ? (
              <div>
                <h2>Results ({memoizedResults.length})</h2>
                <Virtuoso
                  style={{ height: "600px" }}
                  totalCount={memoizedResults.length}
                  itemContent={(index) => {
                    const hadith = memoizedResults[index];
                    return (
                      <div
                        style={{
                          border: "1px solid #ddd",
                          padding: "15px",
                          marginBottom: "10px",
                          borderRadius: "5px",
                          backgroundColor: "whitesmoke"
                        }}
                      >
                        <h3>
                          {hadith.bookName} - Chapter {hadith.chapterId}, Hadith {hadith.idInBook}
                        </h3>
                        <p>{hadith.arabic}</p>
                        <p>{hadith.english.narrator} {hadith.english.text}</p>
                      </div>
                    );
                  }}
                />
              </div>
            ) : (
              query && <p>No results found for "{query}"</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default HadithLearn;
