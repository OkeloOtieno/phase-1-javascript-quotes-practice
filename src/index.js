document.addEventListener('DOMContentLoaded', async function() {

    async function fetchQuotes(){
        try {
            const response = await fetch('http://localhost:3000/quotes?_embed=likes');
            const data = await response.json();
            displayQuotes(data);
        } catch (error) {
            console.error('Error fetching quotes:', error);
        }
    }

    function displayQuotes(quotes) {
        const quotesUl = document.getElementById('quote-list');
        quotesUl.innerHTML = '';

        quotes.forEach(quote => {
            const listItem = document.createElement('li');
            listItem.classList = 'quote-card';

            listItem.innerHTML = `<blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success'>Likes:<span> 0</span></button>
            <button class='btn-danger' data-quote-id='${quote.id}'>Delete</button>
          </blockquote>`; 
            quotesUl.appendChild(listItem);
        });


        quotesUl.addEventListener('click', function(event) {
            if (event.target.classList.contains('btn-danger')) {
                const quoteId = event.target.getAttribute('data-quote-id');
                deleteQuote(quoteId);
            }
        });
    }

    const form = document.getElementById('new-quote-form');
    form.addEventListener('submit', handleSubmit);

    async function handleSubmit(event){
        event.preventDefault();
        const newQuote = document.getElementById('new-quote').value;
        const newAuthor = document.getElementById('author').value;
    
        try {
            const response = await fetch('http://localhost:3000/quotes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    quote: newQuote,
                    author: newAuthor
                })
            });
            const data = await response.json();
            fetchQuotes();
        } catch (error) {
            console.error('Error adding quote:', error);
        }
    }

    async function deleteQuote(id) {
        try {
            await fetch(`http://localhost:3000/quotes/${id}`, {
                method: 'DELETE'
            });
            fetchQuotes();
        } catch (error) {
            console.error('Error deleting', error)
        }
    }

    fetchQuotes();
});
