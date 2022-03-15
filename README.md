# Diary

## Week 1
- Read parts of [0], [1], [2], [3]
- Understand the big picture
- Understand the concepts of synchronizability, <!-- $\exists k$ --> <img style="transform: translateY(0.1em); background: white;" src="https://render.githubusercontent.com/render/math?math=%5Cexists%20k">-bounded MSCs, <!-- $\forall k$ --> <img style="transform: translateY(0.1em); background: white;" src="https://render.githubusercontent.com/render/math?math=%5Cforall%20k">-bounded MSCs

## Week 2
- Setup a GitHub repository and a local LaTeX environment
- Read parts of [4] and [5]
- Rationalize content of main references (README in the references directory)
- Understand the causal relation in literature and the several examples of MSCs by Laetitia
- With professor Di Giusto:
  - Understand Proposition 18 (STW-boundness of weakly synchronous mailbox MSCs)
  - Intuition for the proof of Lemma 10 (but the provided proof seems incomplete)
- Understand the difference between *(n-1)* and *mailbox* communication (subtle, not only unmatched messages...)
- Read about split-width (an alternative to special tree-width for bounded degree graphs)
- Hands-on
  - Put useful definitions and sections of [0] into the report
  - Provide definition of *causally ordered MSC* (without considering unmatched messages, for now)
  - Build the foundation for results about synchronizability for causal order communication, following the approach taken in [0]
    - MSO-definability of causally ordered MSCs
    - Bounded model-checking for causal order
    - Reduction of synchronizability problem to bounded model-checking for causal order
    - Decidability of synchronicity for causal order and classes that are MSO-definable and STW-bounded
    - MSO-definability of weakly synchronous causally ordered MSCs
    - Are weakly synchronous causally ordered MSCs STW-bounded???
- To ask:
  - Should I commit report.pdf?
  - I can't compile the LaTeX for [0], I don't know why
  - Make sure my understanding of causal order, mailbox, and *n-1* is correct
  - Review my definitions and proofs about causally ordered MSCs
  - Discuss STW-boundness of weakly synchronous causally ordered MSCs. Investigate if the reduction from PCP to p2p weakly synchronicity can also be done with causal order.

## Week 2
- Todo:
  - Adjust definitions and proofs of week 1
    - Do not talk about causal order linearization
    - Go back to the first definition that I gave of causally ordered MSC
  - Read proof of reduction from PCP to p2p (synchronizability for weakly synchronous p2p)
  - See if the proof can be adapted for causally ordered
  - Take a look at the documents sent by professor Lozes and understand his notation for Lamport and causal order
  - Rest

**[0]** A Unifying Framework for Deciding Synchronizability\
**[1]** Reasoning about Distributed Systems: WYSIWYG\
**[2]** Non-Sequential Theory of Distributed Systems\
**[3]** On Communicating Automata with Bounded Channels\
**[4]** Synchronous, asynchronous, and causally ordered communication\
**[5]** Laetitia PhD thesis
