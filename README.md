# Diary

## Week 1
- [x] Read parts of [0], [1], [2], [3]
- [x] Understand the big picture
- [x] Understand the concepts of synchronizability, <!-- $\exists k$ --> <img style="transform: translateY(0.1em); background: white;" src="https://render.githubusercontent.com/render/math?math=%5Cexists%20k">-bounded MSCs, <!-- $\forall k$ --> <img style="transform: translateY(0.1em); background: white;" src="https://render.githubusercontent.com/render/math?math=%5Cforall%20k">-bounded MSCs

## Week 2
- [x] Setup a GitHub repository and a local LaTeX environment
- [x] Read parts of [4] and [5]
- [x] Rationalize content of main references (README in the references directory)
- [x] Understand the causal relation in literature and the several examples of MSCs by Laetitia
- With professor Di Giusto:
  - [x] Understand Proposition 18 (STW-boundness of weakly synchronous mailbox MSCs)
  - [x] Intuition for the proof of Lemma 10 (but the provided proof seems incomplete)
-  [x] Understand the difference between *(n-1)* and *mailbox* communication (*n-1* is *mailbox* without unmatched messages)
- [x] Read about split-width (an alternative to special tree-width for bounded degree graphs)
- Hands-on
  - [x] Put useful definitions and sections of [0] into the report
  - [x] Provide definition of *causally ordered MSC* (without considering unmatched messages, for now)
  - [x] Build the foundation for results about synchronizability for causal ordering, following the approach taken in [0]
    - [x] MSO-definability of causally ordered MSCs
    - [x] Bounded model-checking for causal ordering
    - [x] Reduction of synchronizability problem to bounded model-checking for causal ordering
    - [x] Decidability of synchronicity for causal ordering and classes that are MSO-definable and STW-bounded
    - [x] MSO-definability of weakly synchronous causally ordered MSCs
    - [x] STW-boundness of weakly *k*-synchronous causally ordered MSCs
    - [x] Decidability of synchronicity for weakly *k*-synchronous causally ordered MSCs

## Week 3
- Adjust definitions and proofs of week 2
  - [x] Definition of causally ordered MSC
  - [x] Set of causally ordered MSCs is MSO-definable
  - [x] Decidability of bounded model checking for causal ordering
- [x] Proof of prefix-closure for causal ordering
- [x] Undecidability of synchronicity for weakly *k*-synchronous causally ordered MSCs (Post correspondence problem proof)
- [x] Unbounded special tree-width for weakly synchronous causally ordered MSCs
- [x] Have a clear understanding of causal order MCS, causal delivery MSC, and mailbox MSC
- [x] Take a look at the documents sent by professor Lozes

## Week 4
- [x] New definition of causally ordered MSC
- [x] Adjust proofs on causally ordered MSCs according to new definition 
- [x] Alternative equivalent definition of mailbox MSC
- [x] Definition of existentially k causally ordered bounded MSC
- [x] Decidability of synchronicity problem for Ek-co-bounded MSCs  
- Rationalize content and find a suitable order of presenting different arguments:
  - [x] High level overview of communication architectures (inspired by [8])
  - [x] Definition of asynchonous MSC
  - [x] Hierarchy of the considered MSC classes
- To ask:
  - [ ] Why does the PCP reduction proof work for p2p? What if a message sent from a prover is unmatched and all the subsequent are blocked even if the solution is valid for PCP?

**[0]** A Unifying Framework for Deciding Synchronizability - Bollig, Di Giusto, Finkel, Laversa, Lozes, Suresh\
**[1]** Reasoning about Distributed Systems: WYSIWYG - Aiswarya, Gastin\
**[2]** Non-Sequential Theory of Distributed Systems - Bollig, Gastin\
**[3]** On Communicating Automata with Bounded Channels - Genest, Kuske, Muscholl\
**[4]** Synchronous, Asynchronous, and Causally Ordered Communication - Charron-Bost, Mattern, Tel\
**[5]** Laetitia PhD thesis\
**[6]** A Non-Blocking Lightweight Implementation of Causal Order Message Delivery - Mattern, Funfrocken\
**[7]** A New Algorithm to Implement Causal Order - Shiper, Eggli, Sandoz\
**[8]** On the Diversity of Asynchonous Communication - Chevrou, Hurault, Quéinnec\

