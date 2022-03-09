List the main definition/concepts in each reference.

**A Unifying Framework for Deciding Synchronizability**
- Message Sequence Charts (MSCs)
- p2p and Mailbox MSCs (process, message and mailbox relations)
- Linearizations, Prefixes and Concatenation of MSCs
- Model checking and bounded model checking
- Syncronizability:
  - Weakly synchronizable
  - Weakly k-synchronizable
  - Strongly syncronizable
  - Strongly k-syncronizable
- Relation between synchronizability and existentially/universally bounded MSCs, both for p2p and mailbox

**[1] Reasoning about Distributed Systems: WYSIWYG**
- Very well written, nicest introductory paper IMO :thumbsup:
- Interleaved/word based semantics VS partial order/graph based semantics
- Undecidability
- Under-approximation techniques with a graphic theoretic approach to verification problems
- Split-width (similar to treewidth) and tree decomposition with nice pictures
- Definitions:
  - System of concurrent processes with data structures (CPDS)
  - Concurrent behaviour matching (CBM) and run of a CPDS on a CBM
  - Monadic Second-Order logic (MSO) and Propositional Dynamic Logic (PDL) on CMBs

**[2] Non-Sequential Theory of Distributed Systems**
- Chapter 1 provides some nice examples of the kind of problems that can arise when reasoning about distributed systems
- Special tree-width (STW) with example picture and Special Tree-width Terms (STT)
- Tree interpretation for STT (to read, heavy on notation) 
- Much of the content overlaps with [1], but it is not as well written IMO

**[3] On Communicating Automata with Bounded Channels**
- Definitions:
  - Universally and existentially k-bounded MSCs (p.6, Def 3.2)