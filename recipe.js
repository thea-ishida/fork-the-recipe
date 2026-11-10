// Editable content for Fork the Recipe.
// Change the words here; script.js reads everything from this file.
//
// NOTE FOR THEA: the original amounts below come from the JoyFoodSunshine recipe card
// as I remember it (the card would not load for me). The 2 cups of chips, the 375°F oven,
// the 8-10 minute bake and the 30 minute total time ARE confirmed from the page.
// Check the rest against the card before you submit.

window.RECIPE = {
  title: "Fork the Recipe",
  original: {
    name: "five-star.recipe",
    source: "Laura Sandford, \"The Best Chocolate Chip Cookie Recipe Ever,\" JoyFoodSunshine",
    lines: [
      "# Ingredients",
      "1 cup salted butter, softened",
      "1 cup granulated sugar",
      "1 cup light brown sugar, packed",
      "2 tsp pure vanilla extract",
      "2 large eggs",
      "3 cups all-purpose flour",
      "1 tsp baking soda",
      "1/2 tsp baking powder",
      "1 tsp sea salt",
      "2 cups chocolate chips",
      "# Method",
      "Preheat the oven to 375°F.",
      "Mix the flour, baking soda, baking powder and salt.",
      "Cream the softened butter with both sugars for 1 minute.",
      "Beat in the eggs and vanilla.",
      "Add the dry ingredients until just combined.",
      "Stir in the chocolate chips.",
      "Roll into balls and bake 8-10 minutes.",
      "Cool on the pan for 5 minutes."
    ]
  },

  // Thea's version. A line with a `note` gets a review comment under it.
  // A line with only `src` is coloured by source but has no comment.
  // source: reel | hands | taste | twist      pace: fast | slow | (leave out)
  thea: {
    name: "theas-cookies.recipe",
    lines: [
      "# Ingredients",
      { text: "1 cup salted butter, browned",
        note: { source: "reel", pace: "fast",
          why: "Saw brown butter cookies in an Instagram reel. I took the browned butter but skipped the reel's two-hour recipe." } },
      "1 cup granulated sugar",
      "1 cup light brown sugar, packed",
      "2 tsp pure vanilla extract",
      "2 large eggs",
      { text: "a little less than 3 cups all-purpose flour",
        note: { source: "hands", pace: "slow",
          why: "The dough was too hard to mix the chocolate into, so I cut the flour." } },
      "1 tsp baking soda",
      "1/2 tsp baking powder",
      "1 tsp sea salt",
      { text: "1 Cadbury dark chocolate bar, broken into bits",
        note: { source: "taste",
          why: "I wanted higher-end chocolate than store-bought baking chips." } },
      { text: "caramel, for drizzling", src: "twist" },
      { text: "Himalayan pink salt, for sprinkling", src: "twist" },
      "# Method",
      "Preheat the oven to 375°F.",
      "Mix the flour, baking soda, baking powder and salt.",
      { text: "Brown the butter, then mix it with both sugars.", src: "reel" },
      "Beat in the eggs and vanilla.",
      "Add the dry ingredients until just combined.",
      { text: "Stir in the broken chocolate.", src: "taste" },
      "Roll into balls and bake 8-10 minutes.",
      "Cool on the pan for 5 minutes.",
      { text: "Drizzle caramel over the cookies and sprinkle with pink salt.",
        note: { source: "twist",
          why: "Added after baking. My own idea, not from either recipe." } }
    ]
  },

  // Waters' nine principles, word for word (The Art of Simple Food, pp. 6-7).
  principles: {
    name: "waters-principles.md",
    source: "Alice Waters, The Art of Simple Food, pp. 6-7",
    lines: [
      "Eat locally and sustainably.",
      "Eat seasonally.",
      "Shop at farmers' markets.",
      "Plant a garden.",
      "Conserve, compost, and recycle.",
      "Cook simply, engaging all your senses.",
      "Cook together.",
      "Eat together.",
      "Remember food is precious."
    ]
  },

  // Real times only. Minutes.
  times: [
    { label: "Five-star recipe card (listed total)", minutes: 30, pace: "fast" },
    { label: "My cookies, start to finish", minutes: 60, pace: "mid" },
    { label: "The reel's brown butter recipe", minutes: 120, pace: "slow" }
  ],

  sources: {
    reel:  "A reel",
    hands: "My hands",
    taste: "My taste",
    twist: "My own twist",
    other: "Someone else",
    onhand: "What I had on hand"
  }
};
