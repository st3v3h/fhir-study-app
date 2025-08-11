import React, { useState, useEffect, useMemo } from 'react';
import fhirResourceData from './fhirResources.json';

// --- Helper Functions ---
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
};


// --- Components ---

const Header = ({ setView }) => (
    <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v11.494m-5.247-8.995l10.494 6.494-10.494-6.494zM12 21.747L6.753 18.253m5.247 3.494L17.247 18.253" />
                    </svg>
                    <span className="ml-3 text-2xl font-bold text-gray-800">FHIR Study Tool</span>
                </div>
                <nav className="flex space-x-4">
                    <button onClick={() => setView('home')} className="text-gray-600 hover:text-blue-600 font-medium">Home</button>
                    <button onClick={() => setView('favorites')} className="text-gray-600 hover:text-blue-600 font-medium">Favorites</button>
                </nav>
            </div>
        </div>
    </header>
);

const StudySetSelector = ({ onStart, allResources }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubCategory, setSelectedSubCategory] = useState('All');

    const categories = useMemo(() => ['All', ...new Set(allResources.map(r => r.category))], [allResources]);
    const subCategories = useMemo(() => {
        if (selectedCategory === 'All') {
            return ['All'];
        }
        return ['All', ...new Set(allResources.filter(r => r.category === selectedCategory).map(r => r.subCategory))];
    }, [selectedCategory, allResources]);

    useEffect(() => {
        setSelectedSubCategory('All');
    }, [selectedCategory]);

    const handleStart = (mode) => {
        let studySet = allResources;
        if (selectedCategory !== 'All') {
            studySet = studySet.filter(r => r.category === selectedCategory);
        }
        if (selectedSubCategory !== 'All') {
            studySet = studySet.filter(r => r.subCategory === selectedSubCategory);
        }
        onStart(mode, shuffleArray([...studySet]));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create Your Study Set</h2>
            <p className="text-gray-600 mb-6">Select a category and sub-category to focus your study session.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select id="category" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-1">Sub-Category</label>
                    <select id="subCategory" value={selectedSubCategory} onChange={(e) => setSelectedSubCategory(e.target.value)} className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" disabled={selectedCategory === 'All'}>
                        {subCategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <button onClick={() => handleStart('flashcards')} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    Start Flashcards
                </button>
                <button onClick={() => handleStart('quiz')} className="w-full sm:w-auto flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    Start Quiz
                </button>
            </div>
        </div>
    );
};

const FlashcardMode = ({ studySet, favorites, toggleFavorite }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const currentCard = studySet[currentIndex];
    const isFavorited = favorites.some(fav => fav.name === currentCard.name);

    const handleNext = () => {
        if (currentIndex < studySet.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
            {/* Progress Bar */}
            <div className="w-full mb-4">
                <p className="text-center text-gray-600 mb-2">Progress: {currentIndex + 1} / {studySet.length}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${((currentIndex + 1) / studySet.length) * 100}%` }}></div>
                </div>
            </div>

            {/* Flashcard */}
            <div className="relative w-full h-80 perspective-1000">
                <div 
                    className={`absolute w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
                    onClick={() => setIsFlipped(!isFlipped)}
                >
                    {/* Front of Card */}
                    <div className="absolute w-full h-full backface-hidden bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col justify-center items-center p-6 cursor-pointer">
                        <h2 className="text-4xl font-bold text-gray-800 text-center">{currentCard.name}</h2>
                        <p className="text-sm text-gray-500 mt-4">(Click to reveal definition)</p>
                    </div>
                    {/* Back of Card */}
                    <div className="absolute w-full h-full backface-hidden bg-blue-50 rounded-lg shadow-xl border border-blue-200 flex flex-col justify-center p-6 rotate-y-180">
                        <h3 className="text-xl font-semibold text-blue-800 mb-2">{currentCard.name}</h3>
                        <p className="text-gray-700 text-center">{currentCard.definition}</p>
                         <p className="text-sm text-gray-500 mt-4 text-center">Category: {currentCard.category} {'>'} {currentCard.subCategory}</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between w-full mt-6">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="px-6 py-2 rounded-md bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 disabled:cursor-not-allowed transition">Prev</button>
                <button onClick={() => toggleFavorite(currentCard)} className="p-3 rounded-full hover:bg-yellow-100 transition">
                    <svg className={`w-8 h-8 ${isFavorited ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                </button>
                <button onClick={handleNext} disabled={currentIndex === studySet.length - 1} className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition">Next</button>
            </div>
        </div>
    );
};

const QuizMode = ({ studySet, favorites, toggleFavorite, allResources }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [showResult, setShowResult] = useState(false);

    const currentQuestion = studySet[currentIndex];
    const isFavorited = favorites.some(fav => fav.name === currentQuestion.name);

    const options = useMemo(() => {
        if (!currentQuestion) return [];
        const wrongAnswers = allResources
            .filter(r => r.name !== currentQuestion.name)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);
        return shuffleArray([...wrongAnswers, currentQuestion]);
    }, [currentIndex, currentQuestion, allResources]);

    const handleAnswer = (answer) => {
        if (showResult) return;
        setSelectedAnswer(answer);
        setShowResult(true);
        if (answer.name === currentQuestion.name) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < studySet.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };
    
    if (!currentQuestion) {
        return <div className="text-center p-8">Loading quiz...</div>
    }

    return (
        <div className="w-full max-w-3xl mx-auto">
            {/* Progress and Score */}
            <div className="flex justify-between items-center mb-4">
                <p className="text-gray-600">Question: {currentIndex + 1} / {studySet.length}</p>
                <p className="font-semibold text-green-600">Score: {score}</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${((currentIndex + 1) / studySet.length) * 100}%` }}></div>
            </div>

            {/* Question Card */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-start">
                    <p className="text-lg text-gray-800 mb-6">Which FHIR resource is described as: <br/><strong className="font-semibold">"{currentQuestion.definition}"</strong></p>
                    <button onClick={() => toggleFavorite(currentQuestion)} className="p-2 rounded-full hover:bg-yellow-100 transition -mt-2 -mr-2">
                        <svg className={`w-6 h-6 ${isFavorited ? 'text-yellow-400 fill-current' : 'text-gray-400'}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option, index) => {
                        const isCorrect = option.name === currentQuestion.name;
                        const isSelected = selectedAnswer && selectedAnswer.name === option.name;
                        let buttonClass = 'border-gray-300 bg-white hover:bg-gray-50';
                        if (showResult) {
                            if (isCorrect) {
                                buttonClass = 'border-green-500 bg-green-100 text-green-800';
                            } else if (isSelected) {
                                buttonClass = 'border-red-500 bg-red-100 text-red-800';
                            }
                        }
                        return (
                            <button key={index} onClick={() => handleAnswer(option)} disabled={showResult} className={`p-4 rounded-md border-2 text-left transition ${buttonClass}`}>
                                {option.name}
                            </button>
                        );
                    })}
                </div>

                {showResult && (
                    <div className="mt-6 text-center">
                        <button onClick={handleNext} disabled={currentIndex === studySet.length - 1} className="px-8 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition">
                            Next Question
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const FavoritesMode = ({ favorites, toggleFavorite, setView }) => {
    if (favorites.length === 0) {
        return (
            <div className="text-center p-10 bg-white rounded-lg shadow-md">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.539 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.539-1.118l1.518-4.674a1 1 0 00-.363-1.118L2.049 9.41c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <h3 className="mt-2 text-xl font-medium text-gray-900">No Favorite Cards</h3>
                <p className="mt-1 text-sm text-gray-500">You haven't starred any cards yet. Star cards during your study sessions to review them here.</p>
                <div className="mt-6">
                    <button type="button" onClick={() => setView('home')} className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Start Studying
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Favorite Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favorites.map(card => (
                    <div key={card.name} className="bg-white rounded-lg shadow-lg p-5 flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-800">{card.name}</h3>
                            <p className="text-gray-600 mt-2">{card.definition}</p>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                             <p className="text-xs text-gray-500">{card.category} {'>'} {card.subCategory}</p>
                            <button onClick={() => toggleFavorite(card)} className="p-2 rounded-full hover:bg-yellow-100 transition">
                                <svg className="w-6 h-6 text-yellow-400 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
};


// --- Main App Component ---
export default function App() {
    const [view, setView] = useState('home'); // 'home', 'flashcards', 'quiz', 'favorites'
    const [studySet, setStudySet] = useState([]);
    const [favorites, setFavorites] = useState(() => {
        const saved = localStorage.getItem('fhirFavorites');
        return saved ? JSON.parse(saved) : [];
    });
    const [allResources, setAllResources] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setAllResources(fhirResourceData);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        localStorage.setItem('fhirFavorites', JSON.stringify(favorites));
    }, [favorites]);

    const toggleFavorite = (card) => {
        setFavorites(prevFavorites => {
            const isFavorited = prevFavorites.some(fav => fav.name === card.name);
            if (isFavorited) {
                return prevFavorites.filter(fav => fav.name !== card.name);
            } else {
                return [...prevFavorites, card];
            }
        });
    };

    const handleStart = (mode, selectedSet) => {
        if (selectedSet.length === 0) {
            alert("No resources found for the selected criteria. Please broaden your selection.");
            return;
        }
        setStudySet(selectedSet);
        setView(mode);
    };

    const renderContent = () => {
        if (isLoading) {
            return <div className="text-center p-10">Loading resources...</div>;
        }

        switch (view) {
            case 'flashcards':
                return <FlashcardMode studySet={studySet} favorites={favorites} toggleFavorite={toggleFavorite} />;
            case 'quiz':
                return <QuizMode studySet={studySet} favorites={favorites} toggleFavorite={toggleFavorite} allResources={allResources} />;
            case 'favorites':
                return <FavoritesMode favorites={favorites} toggleFavorite={toggleFavorite} setView={setView} />;
            case 'home':
            default:
                return <StudySetSelector onStart={handleStart} allResources={allResources} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Header setView={setView} />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
            <footer className="text-center py-4 mt-8 text-sm text-gray-500">
                <p>Built to help you ace the FHIR Implementer Exam. Good luck!</p>
            </footer>
        </div>
    );
}
