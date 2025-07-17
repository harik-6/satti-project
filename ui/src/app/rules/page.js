"use client"
import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardMedia from '@mui/material/CardMedia';

export default function Rules() {


  useEffect(() => {
  }, []);

 

  const cards = [
    {
      title: "Rule 1",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
      description: "This is a sample rule card. You can describe a rule here."
    },
    {
      title: "Rule 2",
      image: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80",
      description: "Another example rule. Add your own content as needed."
    },
    {
      title: "Rule 3",
      image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80",
      description: "Third rule card for demonstration. Customize as you wish."
    }
  ];

  return (
    <div className="flex justify-center items-start pt-4">
      <div className="flex flex-row gap-6">
        {cards.map((card, idx) => (
          <Card key={idx}>
            <CardMedia
              component="img"
              image={card.image}
              alt={card.title}
            />
            <CardHeader title={card.title} />
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {card.description}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 