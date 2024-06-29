import { useEffect, useState } from 'react'
import supabase from './supabase'
import './style.css'

function App() {
	const [showForm, setShowForm] = useState(false)
	const [facts, setFacts] = useState([])
	const [currentCategory, setCurrentCategory] = useState('all')

	useEffect(
		function () {
			// this function will only run at the begining only when the application first loads
			async function getFacts() {
				// store in query fact table from supabase and all columns from the table
				let query = supabase.from('facts').select('*')

				if (currentCategory !== 'all') query = query.eq('category', currentCategory)

				// Data fetching
				const { data: facts } = await query
				setFacts(facts)
			}
			getFacts()
		},
		[currentCategory]
	)

	return (
		<>
			<Header showForm={showForm} setShowForm={setShowForm} />
			{showForm ? <NewFactForm setFacts={setFacts} setShowForm={setShowForm} /> : null}

			<main className='main'>
				<CategoryFilter setCurrentCategory={setCurrentCategory} />
				<FactList facts={facts} />
			</main>
		</>
	)
}
function Header({ showForm, setShowForm }) {
	const appTitle = 'Today I Learned'
	return (
		<header className='header'>
			<div className='logo'>
				<img src='logo.png' height='68' width='68' alt='Today I Learned logo' />
				<h1>{appTitle}</h1>
			</div>

			<button className='btn btn-large' onClick={() => setShowForm(show => !show)}>
				{showForm ? 'Close' : 'Share a fact'}
			</button>
		</header>
	)
}

const CATEGORIES = [
	{ name: 'technology', color: '#3b82f6' },
	{ name: 'science', color: '#16a34a' },
	{ name: 'finance', color: '#ef4444' },
	{ name: 'society', color: '#eab308' },
	{ name: 'entertainment', color: '#db2777' },
	{ name: 'health', color: '#14b8a6' },
	{ name: 'history', color: '#f97316' },
	{ name: 'news', color: '#8b5cf6' },
]

function isValidHttpUrl(string) {
	let url
	try {
		url = new URL(string)
	} catch (_) {
		return false
	}
	return url.protocol === 'http:' || url.protocol === 'https:'
}

function NewFactForm({ setFacts, setShowForm }) {
	const [text, setText] = useState('')
	const [source, setSource] = useState('')
	const [category, setCategory] = useState('')
	const textLength = text.length

	async function handleSubmit(e) {
		// 1. Prevent browser reload
		e.preventDefault()

		// 2. Check if the data is valid. If so,create a new fact
		if (text && isValidHttpUrl(source) && category && textLength <= 200) {
			// 3. Create a new fact object
			// const newFact = {
			// 	id: Math.round(Math.random() * 10000000),
			// 	text,
			// 	source,
			// 	category,
			// 	votesInteresting: 0,
			// 	votesMindblowing: 0,
			// 	votesFalse: 0,
			// 	createdIn: new Date().getFullYear(),
			// }

			// 3. Upload fact to supabase and receive the new fact object
			const { data: newFact } = await supabase.from('facts').insert([{ text, source, category }]).select()
			// 4. Add a new fact to UI: add the fact to state
			setFacts(facts => [newFact[0], ...facts])
			// 5. Reset the input fields back to being empty
			setText('')
			setSource('')
			setCategory('')
			// 6. Close the form
			setShowForm(false)
		}
	}

	return (
		<form className='fact-form' onSubmit={handleSubmit}>
			<input
				type='text'
				placeholder='Share a fact with world...'
				value={text}
				onChange={e => setText(e.target.value)}
			/>
			<span>{200 - text.length}</span>

			<input value={source} type='text' placeholder='Trustworthy source...' onChange={e => setSource(e.target.value)} />

			<select value={category} onChange={e => setCategory(e.target.value)}>
				<option value=''>Choose category:</option>
				{CATEGORIES.map(cat => (
					<option key={cat.name} value={cat.name}>
						{cat.name.toUpperCase()}
					</option>
				))}
			</select>

			<button className='btn btn-large'>Post</button>
		</form>
	)
}

function CategoryFilter({ setCurrentCategory }) {
	return (
		<aside>
			<ul>
				<li className='category'>
					<button className='btn btn-all-categories' onClick={() => setCurrentCategory('all')}>
						All
					</button>
				</li>

				{CATEGORIES.map(cat => (
					<li key={cat.name} className='category'>
						<button
							className='btn btn-category'
							style={{ backgroundColor: cat.color }}
							onClick={() => setCurrentCategory(cat.name)}>
							{cat.name}
						</button>
					</li>
				))}
			</ul>
		</aside>
	)
}

function FactList({ facts }) {
	return (
		<section>
			<ul className='facts-list'>
				{facts.map(fact => (
					<Fact key={fact.id} fact={fact} />
				))}
			</ul>
		</section>
	)
}

function Fact({ fact }) {
	return (
		<li className='fact'>
			<p>
				{fact.text}
				<a className='source' href={fact.source} target='_blank'>
					(Source)
				</a>
			</p>

			<span className='tag' style={{ backgroundColor: CATEGORIES.find(cat => cat.name === fact.category).color }}>
				{fact.category}
			</span>
		</li>
	)
}
export default App
