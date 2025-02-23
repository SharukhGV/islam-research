import React, { useState, useEffect, useRef } from "react";
import quran from "./quran.json"; // Import Quran data
import HadithLearn from "./HadithLearn";

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChapters, setFilteredChapters] = useState(quran);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [quranHadith, setQuranHadith] = useState(false);
  const [searchMode, setSearchMode] = useState("exact"); // Search mode: 'exact' or 'contains'

  const verseRefs = useRef({}); // Store refs for each verse

  // Toggle for information section
  function infoToggle() {
    setToggle(!toggle);
  }

  // Set display mode (Quran or Hadith)
  function setDisplayQuranorHadith() {
    setQuranHadith(!quranHadith);
  }

  // Handle chapter selection
  const handleChapterChange = (e) => {
    const chapterId = Number(e.target.value);
    setSelectedChapter(chapterId);
    setSelectedVerse(null); // Reset verse selection when chapter changes
  };

  // Handle verse selection and scroll to it
  const handleVerseChange = (e) => {
    const verseId = Number(e.target.value);
    setSelectedVerse(verseId);

    // Scroll to the selected verse
    const verseKey = `${selectedChapter}-${verseId}`;
    if (verseRefs.current[verseKey]) {
      verseRefs.current[verseKey].scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  // Filter chapters and verses based on search query
  useEffect(() => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const queryWords = lowerCaseQuery.split(" ").filter(Boolean); // Split query into words

    const filtered = quran.map((chapter) => {
      const filteredVerses = chapter.verses.filter((verse) => {
        if (searchMode === "exact") {
          // Exact phrase match
          return (
            verse.text.toLowerCase().includes(lowerCaseQuery) ||
            verse.translation.toLowerCase().includes(lowerCaseQuery)
          );
        } else {
          // "Contains" match: words can appear in any order within the verse
          return queryWords.every((word) => 
            verse.text.toLowerCase().includes(word) ||
            verse.translation.toLowerCase().includes(word)
          );
        }
      });

      if (
        chapter.name.toLowerCase().includes(lowerCaseQuery) ||
        chapter.transliteration.toLowerCase().includes(lowerCaseQuery) ||
        chapter.translation.toLowerCase().includes(lowerCaseQuery) ||
        chapter.type.toLowerCase().includes(lowerCaseQuery) ||
        filteredVerses.length > 0
      ) {
        return { ...chapter, verses: filteredVerses };
      }
      return null;
    });

    setFilteredChapters(filtered.filter((chapter) => chapter !== null));
    // Reset selected chapter and verse when the search query changes
    setSelectedChapter(null);
    setSelectedVerse(null);
  }, [searchQuery, searchMode]);

  return (
    <div style={{ padding: "20px", color: "black" }}>
      {quranHadith ? (
        <button onClick={setDisplayQuranorHadith}>Show Hadith</button>
      ) : (
        <button onClick={setDisplayQuranorHadith}>Show Quran</button>
      )}

      {quranHadith ? (
        <div
          style={{
            color: "black",
            backgroundColor: "whitesmoke",
            borderStyle: "solid",
            padding: "10px",
            borderColor: "gray",
          }}
        >
          <input
            type="text"
            placeholder="Search chapters, verses, or words (Arabic or English)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              fontSize: "16px",
            }}
          />

          <div>
            <label>
              <input
                type="radio"
                name="searchMode"
                value="exact"
                checked={searchMode === "exact"}
                onChange={() => setSearchMode("exact")}
              />
              Exact Phrase
            </label>
            <label style={{ marginLeft: "10px" }}>
              <input
                type="radio"
                name="searchMode"
                value="contains"
                checked={searchMode === "contains"}
                onChange={() => setSearchMode("contains")}
              />
              Contains Words
            </label>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <select onChange={handleChapterChange} value={selectedChapter || ""}>
              <option value="">Select Chapter</option>
              {quran.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>
                  {chapter.id}. {chapter.name} ({chapter.transliteration})
                </option>
              ))}
            </select>
            {selectedChapter && (
              <select
                onChange={handleVerseChange}
                value={selectedVerse || ""}
                style={{ marginLeft: "10px" }}
              >
                <option value="">Select Verse</option>
                {quran[selectedChapter - 1].verses.map((verse) => (
                  <option key={verse.id} value={verse.id}>
                    Verse {verse.id}
                  </option>
                ))}
              </select>
            )}
          </div>

          {filteredChapters.length > 0 ? (
            <div
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {filteredChapters.map((chapter) => (
                <div
                  key={chapter.id}
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: "5px",
                    padding: "15px",
                    marginBottom: "10px",
                    backgroundColor: "#f9f9f9",
                  }}
                >
                  <h2>
                    {chapter.id}. {chapter.name} ({chapter.transliteration})
                  </h2>
                  <p>
                    <strong>Translation:</strong> {chapter.translation}
                  </p>
                  <p>
                    <strong>Type:</strong> {chapter.type}
                  </p>
                  <p>
                    <strong>Total Verses:</strong> {chapter.total_verses}
                  </p>
                  <div>
                    <h3>Verses:</h3>
                    {chapter.verses.map((verse) => {
                      const verseKey = `${chapter.id}-${verse.id}`;
                      return (
                        <div
                          key={verse.id}
                          ref={(el) => (verseRefs.current[verseKey] = el)}
                          style={{
                            marginBottom: "10px",
                            backgroundColor:
                              selectedChapter === chapter.id &&
                              selectedVerse === verse.id
                                ? "yellow"
                                : "transparent",
                          }}
                        >
                          <p>
                            <strong>{verse.id}:</strong> {verse.text}
                          </p>
                          <p>
                            <em>{verse.translation}</em>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No results found matching your search.</p>
          )}
        </div>
      ) : (
        <HadithLearn />
      )}
    </div>
  );
};

export default App;
