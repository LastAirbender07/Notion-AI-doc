/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Bindings = {
	GEMINI_KEY: string;
	AI: Ai;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use(
	'/*',
	cors({
		origin: '*',
		allowHeaders: ['X-Custom-Header', 'Upgrade-Insecure-Requests', 'Content-Type'],
		allowMethods: ['GET', 'POST', 'PUT', 'OPTIONS'],
		exposeHeaders: ['Content-length', 'X-Kuma-Revision'],
		maxAge: 680,
		credentials: true,
	})
);

app.post('/translate-document', async (c) => {
	const { documentData, targetLang } = await c.req.json();
	const summarResponse = await c.env.AI.run('@cf/facebook/bart-large-cnn', { input_text: documentData, max_length: 1000 });
	const TransaltedSummary = await c.env.AI.run('@cf/meta/m2m100-1.2b', {
		text: summarResponse.summary,
		source_lang: 'english',
		target_lang: targetLang,
	});

	return new Response(JSON.stringify(TransaltedSummary));
});

app.post('/chat-to-document', async (c) => {
	const genAI = new GoogleGenerativeAI(`${c.env.GEMINI_KEY}`);
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

	const { documentData, question } = await c.req.json();
	const chat = model.startChat({
		history: [
			{
				role: 'user',
				parts: [
					{
						text: `You are an assistant helping the user to chat to a document, I am providing a json file of the markdown for the document. Using this, answer the user's question in the the clearest way possible, the is about:\n${documentData}`,
					},
				],
			},
		],
	});
	try {
		const result = await chat.sendMessage(`My Question is: ${question}`);
		return new Response(JSON.stringify(result.response.text()));
	} catch (e) {
		return new Response(JSON.stringify(e));
	}
});

app.get('/', async (c) => {
	var text =
		"BGT which stands for Britain's Got Talent, is a popular British television talent show where contestants of all ages showcase their diverse abilities, from singing and dancing to magic and comedy, competing to win a large cash prize and the opportunity to perform on a major stage. Hosted by Ant and Dec, the show is known for its wide range of acts and the occasional surprise audition that leaves judges and audiences astonished.";

	var question = 'Is there any other BGT in cricket?';

	var genAI = new GoogleGenerativeAI(`${c.env.GEMINI_KEY}`);
	const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
	const chat = model.startChat({
		history: [
			{
				role: 'user',
				parts: [
					{
						text: `You are an assistant helping the user to chat to a document, I am providing a json file of the markdown for the document. Using this, answer the user's question in the the clearest way possible, the is about:\n${text}`,
					},
				],
			},
		],
	});
	const result = await chat.sendMessage(`My Question is: ${question}`);
	console.log(result.response.text());

	return new Response('Hello Worker! ' + result.response.text());
});

export default app;
