const dummyData = [
    {
      id: '1', 
      name: 'Team Alpha', 
      rank: 1, 
      round: 'Round 1', 
      score: 85, 
      round1Score: 85, 
      round2Score: 90, 
      averageScore: (85 + 90) / 2, 
      category: 'Tech', 
      teamLead: 'John', 
      email: 'john@example.com',
      criteria: [
        { name: "Innovation", rating: 5 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 3 }
      ]
    },
    {
      id: '1', 
      name: 'Team Alpha', 
      rank: 1, 
      round: 'Round 2', 
      score: 90, 
      round1Score: 85, 
      round2Score: 90, 
      averageScore: (85 + 90) / 2, 
      category: 'Tech', 
      teamLead: 'John', 
      email: 'john@example.com',
      criteria: [
        { name: "Innovation", rating: 5 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 3 }
      ]
    },
    {
      id: '1', 
      name: 'Team Alpha', 
      rank: 1, 
      round: 'Average', 
      score: (85 + 90) / 2, 
      round1Score: 85, 
      round2Score: 90, 
      averageScore: (85 + 90) / 2, 
      category: 'Tech', 
      teamLead: 'John', 
      email: 'john@example.com',
      criteria: [
        { name: "Innovation", rating: 5 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 3 }
      ]
    },
    
    {
      id: '2', 
      name: 'Team Beta', 
      rank: 2, 
      round: 'Round 1', 
      score: 78, 
      round1Score: 78, 
      round2Score: 85, 
      averageScore: (78 + 85) / 2, 
      category: 'Fintech', 
      teamLead: 'Alice', 
      email: 'alice@example.com',
      criteria: [
        { name: "Innovation", rating: 4 },
        { name: "Scalability", rating: 3 },
        { name: "Market Fit", rating: 4 }
      ]
    },
    {
      id: '2', 
      name: 'Team Beta', 
      rank: 2, 
      round: 'Round 2', 
      score: 85, 
      round1Score: 78, 
      round2Score: 85, 
      averageScore: (78 + 85) / 2, 
      category: 'Fintech', 
      teamLead: 'Alice', 
      email: 'alice@example.com',
      criteria: [
        { name: "Innovation", rating: 4 },
        { name: "Scalability", rating: 3 },
        { name: "Market Fit", rating: 4 }
      ]
    },
    {
      id: '2', 
      name: 'Team Beta', 
      rank: 2, 
      round: 'Average', 
      score: (78 + 85) / 2, 
      round1Score: 78, 
      round2Score: 85, 
      averageScore: (78 + 85) / 2, 
      category: 'Fintech', 
      teamLead: 'Alice', 
      email: 'alice@example.com',
      criteria: [
        { name: "Innovation", rating: 4 },
        { name: "Scalability", rating: 3 },
        { name: "Market Fit", rating: 4 }
      ]
    },
    
    {
      id: '3', 
      name: 'Team Gamma', 
      rank: 3, 
      round: 'Round 1', 
      score: 82, 
      round1Score: 82, 
      round2Score: 88, 
      averageScore: (82 + 88) / 2, 
      category: 'HealthTech', 
      teamLead: 'Bob', 
      email: 'bob@example.com',
      criteria: [
        { name: "Innovation", rating: 3 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 5 }
      ]
    },
    {
      id: '3', 
      name: 'Team Gamma', 
      rank: 3, 
      round: 'Round 2', 
      score: 88, 
      round1Score: 82, 
      round2Score: 88, 
      averageScore: (82 + 88) / 2, 
      category: 'HealthTech', 
      teamLead: 'Bob', 
      email: 'bob@example.com',
      criteria: [
        { name: "Innovation", rating: 3 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 5 }
      ]
    },
    {
      id: '3', 
      name: 'Team Gamma', 
      rank: 3, 
      round: 'Average', 
      score: (82 + 88) / 2, 
      round1Score: 82, 
      round2Score: 88, 
      averageScore: (82 + 88) / 2, 
      category: 'HealthTech', 
      teamLead: 'Bob', 
      email: 'bob@example.com',
      criteria: [
        { name: "Innovation", rating: 3 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 5 }
      ]
    },
    
    {
      id: '4', 
      name: 'Team Delta', 
      rank: 4, 
      round: 'Round 1', 
      score: 91, 
      round1Score: 91, 
      round2Score: 95, 
      averageScore: (91 + 95) / 2, 
      category: 'EduTech', 
      teamLead: 'Sara', 
      email: 'sara@example.com',
      criteria: [
        { name: "Innovation", rating: 5 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 4 }
      ]
    },
    {
      id: '4', 
      name: 'Team Delta', 
      rank: 4, 
      round: 'Round 2', 
      score: 95, 
      round1Score: 91, 
      round2Score: 95, 
      averageScore: (91 + 95) / 2, 
      category: 'EduTech', 
      teamLead: 'Sara', 
      email: 'sara@example.com',
      criteria: [
        { name: "Innovation", rating: 5 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 4 }
      ]
    },
    {
      id: '4', 
      name: 'Team Delta', 
      rank: 4, 
      round: 'Average', 
      score: (91 + 95) / 2, 
      round1Score: 91, 
      round2Score: 95, 
      averageScore: (91 + 95) / 2, 
      category: 'EduTech', 
      teamLead: 'Sara', 
      email: 'sara@example.com',
      criteria: [
        { name: "Innovation", rating: 5 },
        { name: "Scalability", rating: 4 },
        { name: "Market Fit", rating: 4 }
      ]
    },
  ];
  

  export default dummyData;