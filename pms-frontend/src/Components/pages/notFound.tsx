

const NotFound = () => {

    return (
        <>
            <h1 className="text-2xl text-center text-brown-400"> Page Not Fount</h1>
        </>
    )
}

export default NotFound

// interview prep for Mern 
// https://share.google/aimode/rb3zADzj0eyszOO6q

// 15 Day LeetCode Plan
// https://share.google/aimode/vUp9Skvgxg22yb1hK

// The 15-day LeetCode plan Days 1–3: Master Two Pointers and Sliding Window These are powerful techniques often used with arrays and strings to solve problems in linear time. The two-pointer technique involves using two pointers that move toward each other, while the sliding window uses a window that expands or shrinks to find a subarray or substring that satisfies a condition. Key concepts Two pointers: Useful for sorted arrays or problems requiring a pair of elements.Sliding window: Great for finding subarrays or substrings that meet certain criteria. Suggested problems (easy to medium) Two Sum II (Two Pointers)Container With Most Water (Two Pointers)Longest Substring Without Repeating Characters (Sliding Window)Minimum Window Substring (Sliding Window) Days 4–6: Trees and Binary Search Binary search is a highly efficient algorithm for searching in sorted data, and its applications extend beyond simple arrays to more complex scenarios. Trees are a fundamental data structure, and you must know how to traverse them. Key concepts Binary search: Efficient searching in sorted data (\(O(\log n)\)).Tree traversals: Master Breadth-First Search (BFS) and Depth-First Search (DFS).Binary Search Trees (BSTs): Understand their unique properties. Suggested problems (easy to medium) Binary Tree Level Order Traversal (BFS)Maximum Depth of Binary Tree (DFS)Validate Binary Search Tree (Trees)Search in Rotated Sorted Array (Binary Search) Days 7–9: Stacks, Queues, and Hash Maps These versatile data structures are essential for building more complex algorithms. Stacks follow a Last-In, First-Out (LIFO) order, while queues follow a First-In, First-Out (FIFO) order. Hash maps provide \(O(1)\) average-time complexity for lookups, making them indispensable. Key concepts Stack: Great for parsing expressions, backtracking, and depth-first searches.Queue: Used for breadth-first searches and task scheduling.Hash map: The go-to for problems requiring fast lookups, such as finding frequencies or pairs. Suggested problems (easy to medium) Valid Parentheses (Stack)Implement Queue using StacksTop K Frequent Elements (Hash Map + Heap)Subarray Sum Equals K (Hash Map) Days 10–12: Graphs and Greedy Algorithms Graph problems can seem intimidating, but many rely on the tree traversal techniques you've already learned (BFS/DFS). Greedy algorithms make locally optimal choices that hope to lead to a globally optimal solution. Key concepts Graph traversals: Extend your BFS and DFS knowledge to graphs.Greedy algorithms: Useful for optimization problems.Graph representation: Understand adjacency lists vs. adjacency matrices. Suggested problems (medium) Number of Islands (Graph Traversal)Course Schedule (Graph Traversal/Topological Sort)Jump Game (Greedy)Merge Intervals (Sorting + Greedy) Days 13–15: Introduction to Dynamic Programming and review This is the most challenging topic, so your goal is to recognize the pattern and solve a few basic problems, not to master it. Many DP problems involve breaking a larger problem into smaller, overlapping subproblems. Key concepts Optimal substructure and overlapping subproblems: The two tell-tale signs of a DP problem.Tabulation (bottom-up) and memoization (top-down): The two main techniques for solving DP problems. Suggested problems (easy to medium) Climbing Stairs (DP Introduction)Maximum Subarray (DP)Coin Change (DP)