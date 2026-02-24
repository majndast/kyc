-- Seed data for Know Your Code

-- Course 1: Web Basics
INSERT INTO courses (slug, title_cs, title_en, description_cs, description_en, icon, order_index)
VALUES (
  'web-basics',
  'Základy Webu',
  'Web Basics',
  'HTML, CSS a JavaScript - základní stavební kameny každého webu.',
  'HTML, CSS and JavaScript - the building blocks of every website.',
  '🌐',
  1
);

-- Course 2: React Essentials
INSERT INTO courses (slug, title_cs, title_en, description_cs, description_en, icon, order_index)
VALUES (
  'react-essentials',
  'React Essentials',
  'React Essentials',
  'Nauč se React - komponenty, props, state a základní hooky.',
  'Learn React - components, props, state and basic hooks.',
  '⚛️',
  2
);

-- Course 3: Next.js Basics
INSERT INTO courses (slug, title_cs, title_en, description_cs, description_en, icon, order_index)
VALUES (
  'nextjs-basics',
  'Next.js Basics',
  'Next.js Basics',
  'Server komponenty, routing a vše co potřebuješ pro moderní web.',
  'Server components, routing and everything you need for modern web.',
  '▲',
  3
);

-- Lessons for Web Basics
INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'what-is-html', 'Co je HTML?', 'What is HTML?',
'## Co je HTML?

HTML znamená **HyperText Markup Language**. Je to jazyk, který říká prohlížeči, jak má zobrazit obsah webové stránky.

### Základní struktura

Každý HTML dokument má základní strukturu:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Moje stránka</title>
  </head>
  <body>
    <h1>Ahoj světe!</h1>
    <p>Toto je můj první web.</p>
  </body>
</html>
```

### Základní elementy

- `<h1>` až `<h6>` - nadpisy různých úrovní
- `<p>` - odstavec textu
- `<a>` - odkaz na jinou stránku
- `<img>` - obrázek
- `<div>` - kontejner pro seskupení elementů

### Proč je to důležité?

Když AI generuje webovou stránku, generuje právě tento HTML kód. Pokud rozumíš struktuře, můžeš snadno upravit, co AI vytvořilo.',
'## What is HTML?

HTML stands for **HyperText Markup Language**. It tells the browser how to display the content of a web page.

### Basic Structure

Every HTML document has a basic structure:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>My Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>This is my first website.</p>
  </body>
</html>
```

### Basic Elements

- `<h1>` to `<h6>` - headings of different levels
- `<p>` - paragraph of text
- `<a>` - link to another page
- `<img>` - image
- `<div>` - container for grouping elements

### Why Does This Matter?

When AI generates a web page, it generates this HTML code. If you understand the structure, you can easily modify what AI created.',
1
FROM courses WHERE slug = 'web-basics';

INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'css-basics', 'CSS základy', 'CSS Basics',
'## Co je CSS?

CSS znamená **Cascading Style Sheets**. Je to jazyk, který říká prohlížeči, jak má HTML elementy vypadat.

### Jak CSS funguje

CSS pravidla se skládají z **selektoru** a **deklarací**:

```css
h1 {
  color: blue;
  font-size: 24px;
}
```

### Selektory

- `h1` - vybere všechny elementy `<h1>`
- `.class-name` - vybere elementy s třídou `class-name`
- `#id-name` - vybere element s ID `id-name`

### Box Model

Každý element v CSS je jako krabice s:
- **content** - obsah
- **padding** - vnitřní odsazení
- **border** - okraj
- **margin** - vnější odsazení

```css
.box {
  padding: 20px;
  margin: 10px;
  border: 1px solid black;
}
```

### Moderní CSS

Dnes se často používá **Tailwind CSS**, který píše styly přímo do HTML:

```html
<h1 class="text-blue-500 text-2xl">Nadpis</h1>
```',
'## What is CSS?

CSS stands for **Cascading Style Sheets**. It tells the browser how HTML elements should look.

### How CSS Works

CSS rules consist of a **selector** and **declarations**:

```css
h1 {
  color: blue;
  font-size: 24px;
}
```

### Selectors

- `h1` - selects all `<h1>` elements
- `.class-name` - selects elements with class `class-name`
- `#id-name` - selects element with ID `id-name`

### Box Model

Every element in CSS is like a box with:
- **content** - the content
- **padding** - inner spacing
- **border** - the border
- **margin** - outer spacing

```css
.box {
  padding: 20px;
  margin: 10px;
  border: 1px solid black;
}
```

### Modern CSS

Today, **Tailwind CSS** is often used, writing styles directly in HTML:

```html
<h1 class="text-blue-500 text-2xl">Heading</h1>
```',
2
FROM courses WHERE slug = 'web-basics';

INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'javascript-intro', 'JavaScript úvod', 'JavaScript Introduction',
'## Co je JavaScript?

JavaScript je programovací jazyk, který přidává webovým stránkám interaktivitu.

### Proměnné

Proměnné jsou jako krabičky, do kterých ukládáš hodnoty:

```javascript
const name = "Jan";
let age = 25;
```

- `const` - hodnota se nemění
- `let` - hodnota se může měnit

### Funkce

Funkce jsou kousky kódu, které můžeš opakovaně používat:

```javascript
function sayHello(name) {
  return "Ahoj, " + name + "!";
}

sayHello("Jan"); // "Ahoj, Jan!"
```

### Moderní syntaxe

Arrow funkce jsou kratší způsob zápisu:

```javascript
const sayHello = (name) => {
  return "Ahoj, " + name + "!";
};

// Ještě kratší pro jednoduché funkce
const double = (x) => x * 2;
```

### Proč je to důležité?

React, který AI často používá, je celý postavený na JavaScriptu. Bez základů JS neporozumíš React kódu.',
'## What is JavaScript?

JavaScript is a programming language that adds interactivity to web pages.

### Variables

Variables are like boxes where you store values:

```javascript
const name = "John";
let age = 25;
```

- `const` - value does not change
- `let` - value can change

### Functions

Functions are pieces of code you can reuse:

```javascript
function sayHello(name) {
  return "Hello, " + name + "!";
}

sayHello("John"); // "Hello, John!"
```

### Modern Syntax

Arrow functions are a shorter way to write functions:

```javascript
const sayHello = (name) => {
  return "Hello, " + name + "!";
};

// Even shorter for simple functions
const double = (x) => x * 2;
```

### Why Does This Matter?

React, which AI often uses, is entirely built on JavaScript. Without JS basics, you won''t understand React code.',
3
FROM courses WHERE slug = 'web-basics';

-- Lessons for React Essentials
INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'what-is-react', 'Co je React?', 'What is React?',
'## Co je React?

React je **JavaScript knihovna** pro vytváření uživatelských rozhraní. Vytvořil ho Facebook a dnes je jednou z nejpopulárnějších technologií pro tvorbu webů.

### Proč React?

- **Komponenty** - můžeš rozdělit UI na malé, znovupoužitelné části
- **Deklarativní** - popisuješ, jak má UI vypadat, ne jak ho vytvořit
- **Efektivní** - React aktualizuje pouze části, které se změnily

### Tvoje první komponenta

```jsx
function Welcome() {
  return <h1>Vítej v Reactu!</h1>;
}
```

To, co vidíš, se nazývá **JSX** - je to kombinace JavaScriptu a HTML-like syntaxe.

### Jak React funguje

1. Píšeš komponenty (funkce, které vrací JSX)
2. React je převede na virtuální DOM
3. React porovná změny a efektivně aktualizuje skutečný DOM

### AI a React

Většina AI nástrojů generuje React kód. Proto je důležité rozumět základům - abys věděl, co AI vytváří a jak to upravit.',
'## What is React?

React is a **JavaScript library** for building user interfaces. It was created by Facebook and is now one of the most popular technologies for building websites.

### Why React?

- **Components** - you can split UI into small, reusable parts
- **Declarative** - you describe how the UI should look, not how to build it
- **Efficient** - React only updates parts that changed

### Your First Component

```jsx
function Welcome() {
  return <h1>Welcome to React!</h1>;
}
```

What you see is called **JSX** - it''s a combination of JavaScript and HTML-like syntax.

### How React Works

1. You write components (functions that return JSX)
2. React converts them to virtual DOM
3. React compares changes and efficiently updates the real DOM

### AI and React

Most AI tools generate React code. That''s why it''s important to understand the basics - so you know what AI creates and how to modify it.',
1
FROM courses WHERE slug = 'react-essentials';

INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'components-jsx', 'Komponenty a JSX', 'Components and JSX',
'## Komponenty

Komponenta je **znovupoužitelný kousek UI**. Je to funkce, která vrací JSX.

```jsx
function Button() {
  return <button>Klikni na mě</button>;
}
```

### Používání komponent

Komponenty používáš jako HTML tagy:

```jsx
function App() {
  return (
    <div>
      <Button />
      <Button />
    </div>
  );
}
```

### JSX pravidla

1. **Jeden kořenový element** - komponenta musí vracet jeden element
2. **className místo class** - v JSX používáš `className`
3. **Uzavřené tagy** - všechny tagy musí být uzavřené (`<img />`)

```jsx
function Card() {
  return (
    <div className="card">
      <img src="foto.jpg" />
      <p>Popisek</p>
    </div>
  );
}
```

### JavaScript v JSX

V JSX můžeš používat JavaScript pomocí složených závorek:

```jsx
function Greeting() {
  const name = "Jan";
  return <h1>Ahoj, {name}!</h1>;
}
```',
'## Components

A component is a **reusable piece of UI**. It''s a function that returns JSX.

```jsx
function Button() {
  return <button>Click me</button>;
}
```

### Using Components

You use components like HTML tags:

```jsx
function App() {
  return (
    <div>
      <Button />
      <Button />
    </div>
  );
}
```

### JSX Rules

1. **One root element** - component must return one element
2. **className instead of class** - in JSX you use `className`
3. **Closed tags** - all tags must be closed (`<img />`)

```jsx
function Card() {
  return (
    <div className="card">
      <img src="photo.jpg" />
      <p>Description</p>
    </div>
  );
}
```

### JavaScript in JSX

You can use JavaScript in JSX with curly braces:

```jsx
function Greeting() {
  const name = "John";
  return <h1>Hello, {name}!</h1>;
}
```',
2
FROM courses WHERE slug = 'react-essentials';

INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'props-basics', 'Props - předávání dat', 'Props - Passing Data',
'## Co jsou Props?

Props (properties) jsou způsob, jak předat data z rodičovské komponenty do dětské.

```jsx
function Greeting(props) {
  return <h1>Ahoj, {props.name}!</h1>;
}

// Použití
<Greeting name="Jan" />
```

### Destrukturalizace props

Častěji uvidíš tento zápis:

```jsx
function Greeting({ name }) {
  return <h1>Ahoj, {name}!</h1>;
}
```

### Více props

Komponenta může přijímat více props:

```jsx
function UserCard({ name, age, email }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Věk: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Použití
<UserCard name="Jan" age={25} email="jan@email.cz" />
```

### Props jsou read-only

Props nemůžeš měnit uvnitř komponenty. Jsou pouze pro čtení.

```jsx
// ŠPATNĚ - nikdy neměň props!
function Bad({ name }) {
  name = "Jiné jméno"; // ❌
  return <h1>{name}</h1>;
}
```',
'## What are Props?

Props (properties) are a way to pass data from a parent component to a child.

```jsx
function Greeting(props) {
  return <h1>Hello, {props.name}!</h1>;
}

// Usage
<Greeting name="John" />
```

### Destructuring Props

More commonly you''ll see this syntax:

```jsx
function Greeting({ name }) {
  return <h1>Hello, {name}!</h1>;
}
```

### Multiple Props

A component can receive multiple props:

```jsx
function UserCard({ name, age, email }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Age: {age}</p>
      <p>Email: {email}</p>
    </div>
  );
}

// Usage
<UserCard name="John" age={25} email="john@email.com" />
```

### Props are Read-Only

You cannot modify props inside a component. They are read-only.

```jsx
// WRONG - never modify props!
function Bad({ name }) {
  name = "Different name"; // ❌
  return <h1>{name}</h1>;
}
```',
3
FROM courses WHERE slug = 'react-essentials';

INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'state-usestate', 'State a useState', 'State and useState',
'## Co je State?

State je data, která se mohou v komponentě měnit. Na rozdíl od props, state je interní a komponenta ho může měnit.

### useState hook

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Počet: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}
```

### Jak useState funguje

1. `useState(0)` - vytvoří state s počáteční hodnotou 0
2. `count` - aktuální hodnota
3. `setCount` - funkce pro změnu hodnoty

### Pravidla

- **Nikdy neměň state přímo**: `count = 5` ❌
- **Vždy používej setter**: `setCount(5)` ✅

### State s objekty

```jsx
const [user, setUser] = useState({ name: "", age: 0 });

// Změna jedné vlastnosti
setUser({ ...user, name: "Jan" });
```

### Kdy použít State?

- Formulářové vstupy
- Přepínače (otevřeno/zavřeno)
- Počítadla
- Data načtená z API',
'## What is State?

State is data that can change in a component. Unlike props, state is internal and the component can modify it.

### useState Hook

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}
```

### How useState Works

1. `useState(0)` - creates state with initial value 0
2. `count` - current value
3. `setCount` - function to change the value

### Rules

- **Never modify state directly**: `count = 5` ❌
- **Always use the setter**: `setCount(5)` ✅

### State with Objects

```jsx
const [user, setUser] = useState({ name: "", age: 0 });

// Changing one property
setUser({ ...user, name: "John" });
```

### When to Use State?

- Form inputs
- Toggles (open/closed)
- Counters
- Data fetched from API',
4
FROM courses WHERE slug = 'react-essentials';

-- Quiz questions for HTML lesson
INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Co znamená zkratka HTML?',
'What does HTML stand for?',
NULL,
'[
  {"text_cs": "Hyper Text Markup Language", "text_en": "Hyper Text Markup Language", "is_correct": true},
  {"text_cs": "High Tech Modern Language", "text_en": "High Tech Modern Language", "is_correct": false},
  {"text_cs": "Home Tool Markup Language", "text_en": "Home Tool Markup Language", "is_correct": false},
  {"text_cs": "Hyperlink and Text Markup Language", "text_en": "Hyperlink and Text Markup Language", "is_correct": false}
]',
'HTML znamená HyperText Markup Language - jazyk pro značkování hypertextu.',
'HTML stands for HyperText Markup Language - a language for marking up hypertext.',
1
FROM lessons WHERE slug = 'what-is-html';

INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Který tag se používá pro nadpis první úrovně?',
'Which tag is used for a first-level heading?',
NULL,
'[
  {"text_cs": "<h1>", "text_en": "<h1>", "is_correct": true},
  {"text_cs": "<heading>", "text_en": "<heading>", "is_correct": false},
  {"text_cs": "<head>", "text_en": "<head>", "is_correct": false},
  {"text_cs": "<title>", "text_en": "<title>", "is_correct": false}
]',
'Tag <h1> se používá pro hlavní nadpis stránky. <head> obsahuje metadata, <title> je titulek v záložce prohlížeče.',
'The <h1> tag is used for the main heading. <head> contains metadata, <title> is the browser tab title.',
2
FROM lessons WHERE slug = 'what-is-html';

-- Quiz questions for CSS lesson
INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Co tento CSS kód dělá?',
'What does this CSS code do?',
'h1 {
  color: blue;
  font-size: 24px;
}',
'[
  {"text_cs": "Nastaví všem h1 modrou barvu a velikost písma 24px", "text_en": "Sets all h1 elements to blue color and 24px font size", "is_correct": true},
  {"text_cs": "Vytvoří nový h1 element", "text_en": "Creates a new h1 element", "is_correct": false},
  {"text_cs": "Odstraní všechny h1 elementy", "text_en": "Removes all h1 elements", "is_correct": false},
  {"text_cs": "Přidá obrázek k h1", "text_en": "Adds an image to h1", "is_correct": false}
]',
'Toto CSS pravidlo cílí na všechny <h1> elementy a nastavuje jim modrou barvu textu a velikost písma 24 pixelů.',
'This CSS rule targets all <h1> elements and sets their text color to blue and font size to 24 pixels.',
1
FROM lessons WHERE slug = 'css-basics';

INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Jak v CSS vybereš element s třídou "button"?',
'How do you select an element with class "button" in CSS?',
NULL,
'[
  {"text_cs": ".button", "text_en": ".button", "is_correct": true},
  {"text_cs": "#button", "text_en": "#button", "is_correct": false},
  {"text_cs": "button", "text_en": "button", "is_correct": false},
  {"text_cs": "*button", "text_en": "*button", "is_correct": false}
]',
'Tečka (.) před názvem značí výběr podle třídy. Mřížka (#) je pro ID, samotný název je pro HTML element.',
'A dot (.) before the name indicates class selection. Hash (#) is for ID, just the name is for HTML element.',
2
FROM lessons WHERE slug = 'css-basics';

-- Quiz questions for JavaScript lesson
INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Jaký je rozdíl mezi const a let?',
'What is the difference between const and let?',
NULL,
'[
  {"text_cs": "const nelze změnit, let lze", "text_en": "const cannot be changed, let can", "is_correct": true},
  {"text_cs": "const je pro čísla, let pro text", "text_en": "const is for numbers, let for text", "is_correct": false},
  {"text_cs": "Nejsou žádné rozdíly", "text_en": "There are no differences", "is_correct": false},
  {"text_cs": "let je starší syntaxe", "text_en": "let is older syntax", "is_correct": false}
]',
'Proměnná deklarovaná pomocí const nemůže být znovu přiřazena. Proměnná s let ano.',
'A variable declared with const cannot be reassigned. A variable with let can be.',
1
FROM lessons WHERE slug = 'javascript-intro';

INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Co vrátí tato funkce?',
'What will this function return?',
'const double = (x) => x * 2;
double(5);',
'[
  {"text_cs": "10", "text_en": "10", "is_correct": true},
  {"text_cs": "5", "text_en": "5", "is_correct": false},
  {"text_cs": "25", "text_en": "25", "is_correct": false},
  {"text_cs": "Error", "text_en": "Error", "is_correct": false}
]',
'Arrow funkce double vynásobí vstup (5) dvěma, tedy vrátí 10.',
'The arrow function double multiplies the input (5) by two, returning 10.',
2
FROM lessons WHERE slug = 'javascript-intro';

-- Quiz questions for React lessons
INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Co je JSX?',
'What is JSX?',
NULL,
'[
  {"text_cs": "Kombinace JavaScriptu a HTML-like syntaxe", "text_en": "Combination of JavaScript and HTML-like syntax", "is_correct": true},
  {"text_cs": "Nový programovací jazyk", "text_en": "A new programming language", "is_correct": false},
  {"text_cs": "CSS framework", "text_en": "CSS framework", "is_correct": false},
  {"text_cs": "Databázový jazyk", "text_en": "Database language", "is_correct": false}
]',
'JSX je syntaktické rozšíření JavaScriptu, které umožňuje psát HTML-like kód přímo v JavaScriptu.',
'JSX is a syntactic extension of JavaScript that allows writing HTML-like code directly in JavaScript.',
1
FROM lessons WHERE slug = 'what-is-react';

INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Co tento kód vypíše?',
'What will this code output?',
'function Greeting({ name }) {
  return <h1>Ahoj, {name}!</h1>;
}

<Greeting name="Jan" />',
'[
  {"text_cs": "<h1>Ahoj, Jan!</h1>", "text_en": "<h1>Hello, John!</h1>", "is_correct": true},
  {"text_cs": "<h1>Ahoj, {name}!</h1>", "text_en": "<h1>Hello, {name}!</h1>", "is_correct": false},
  {"text_cs": "Error", "text_en": "Error", "is_correct": false},
  {"text_cs": "<h1>Ahoj, !</h1>", "text_en": "<h1>Hello, !</h1>", "is_correct": false}
]',
'Komponenta přijme prop name s hodnotou "Jan" a vloží ji do JSX pomocí složených závorek.',
'The component receives the name prop with value "John" and inserts it into JSX using curly braces.',
1
FROM lessons WHERE slug = 'props-basics';

INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Jak správně změníš state v Reactu?',
'How do you correctly change state in React?',
'const [count, setCount] = useState(0);',
'[
  {"text_cs": "setCount(count + 1)", "text_en": "setCount(count + 1)", "is_correct": true},
  {"text_cs": "count = count + 1", "text_en": "count = count + 1", "is_correct": false},
  {"text_cs": "count++", "text_en": "count++", "is_correct": false},
  {"text_cs": "useState(count + 1)", "text_en": "useState(count + 1)", "is_correct": false}
]',
'State v Reactu se mění pouze pomocí setter funkce (setCount). Přímá změna proměnné nefunguje.',
'State in React is changed only using the setter function (setCount). Direct variable modification doesn''t work.',
1
FROM lessons WHERE slug = 'state-usestate';

-- Lessons for Next.js Basics
INSERT INTO lessons (course_id, slug, title_cs, title_en, content_cs, content_en, order_index)
SELECT id, 'why-nextjs', 'Proč Next.js?', 'Why Next.js?',
'## Proč Next.js místo plain React?

Next.js je **React framework**, který přidává spoustu užitečných funkcí nad čistý React.

### Co Next.js přidává

- **Routing** - stránky automaticky podle složek
- **Server-side rendering** - lepší SEO a rychlejší načítání
- **API routes** - backend přímo v projektu
- **Optimalizace obrázků** - automatická komprese

### File-based routing

V Next.js složka = URL:

```
app/
  page.tsx          → /
  about/
    page.tsx        → /about
  blog/
    [slug]/
      page.tsx      → /blog/cokoliv
```

### Server vs Client

Next.js rozlišuje dva typy komponent:

```jsx
// Server Component (default)
async function Page() {
  const data = await fetchFromDB();
  return <div>{data}</div>;
}

// Client Component
"use client"
function Counter() {
  const [count, setCount] = useState(0);
  return <button>{count}</button>;
}
```

### Proč je to důležité?

AI nástroje jako v0, Cursor nebo Bolt často generují Next.js kód. Rozumět rozdílu mezi server a client komponentami je klíčové.',
'## Why Next.js Instead of Plain React?

Next.js is a **React framework** that adds many useful features on top of pure React.

### What Next.js Adds

- **Routing** - pages automatically based on folders
- **Server-side rendering** - better SEO and faster loading
- **API routes** - backend directly in the project
- **Image optimization** - automatic compression

### File-based Routing

In Next.js, folder = URL:

```
app/
  page.tsx          → /
  about/
    page.tsx        → /about
  blog/
    [slug]/
      page.tsx      → /blog/anything
```

### Server vs Client

Next.js distinguishes two types of components:

```jsx
// Server Component (default)
async function Page() {
  const data = await fetchFromDB();
  return <div>{data}</div>;
}

// Client Component
"use client"
function Counter() {
  const [count, setCount] = useState(0);
  return <button>{count}</button>;
}
```

### Why Does This Matter?

AI tools like v0, Cursor, or Bolt often generate Next.js code. Understanding the difference between server and client components is crucial.',
1
FROM courses WHERE slug = 'nextjs-basics';

-- Quiz for Next.js
INSERT INTO quiz_questions (lesson_id, question_cs, question_en, code_snippet, options, explanation_cs, explanation_en, order_index)
SELECT id,
'Co musíš přidat na začátek komponenty, aby se stala Client Component?',
'What do you need to add at the beginning of a component to make it a Client Component?',
NULL,
'[
  {"text_cs": "\"use client\"", "text_en": "\"use client\"", "is_correct": true},
  {"text_cs": "\"use server\"", "text_en": "\"use server\"", "is_correct": false},
  {"text_cs": "import client", "text_en": "import client", "is_correct": false},
  {"text_cs": "export client", "text_en": "export client", "is_correct": false}
]',
'Direktiva "use client" na začátku souboru označí komponentu jako Client Component, která může používat useState a další hooky.',
'The "use client" directive at the beginning of a file marks the component as a Client Component, which can use useState and other hooks.',
1
FROM lessons WHERE slug = 'why-nextjs';
