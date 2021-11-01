import fetch from 'node-fetch'
import jsdom from 'jsdom'
const {
    JSDOM
} = jsdom;

const baseURL = "https://www.goodreads.com/quotes/search"

async function goodreadsQuotes({
    q,
    page
}) {
    let quotes = []
    let totalResults = 0;

    await fetch(`${baseURL}?` + new URLSearchParams({ q, page}))
        .then(data => data.text()).then((text) => {
            const dom = new JSDOM(text);
            let totalResultsString = dom.window.document.querySelector(".smallText").textContent
            totalResultsString = totalResultsString.substring(totalResultsString.indexOf("of") + 3, totalResultsString.length - 1).replace(/,/g, "")
            totalResults = Number(totalResultsString)
            dom.window.document.querySelectorAll(".quoteText").forEach(quoteText => {
                quotes.push({
                    text: quoteText.innerHTML.substring(quoteText.innerHTML.indexOf("“"), quoteText.innerHTML.indexOf("”")) // Getting quote 
                        .replace(/<br>/g, "\n") // Replacing html line break to \n
                        .replace(/<b>|<[r'//']b>/g, ""), // Removing some others html tags 
                    authorOrTitle: quoteText.querySelector(".authorOrTitle").textContent.trim()
                })
            })
        }).catch(function (error) {
            throw 'Something went wrong' + error
        });

    return {
        quotes,
        totalResults
    }
}

goodreadsQuotes({
    q: "gay",
    page: 1
})

// module.exports = goodreadsQuotes