"use client"
import React, { useEffect, useState } from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import StreamingMarkup from "@/components/markup/Markup";

export default function Rules() {
  const [open, setOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState(null);
  const [rules, setRules] = useState([]);

  useEffect(() => {
    const fetchRules = async () => {
      const response = await fetch(`http://127.0.0.1:8000/rules`);
      const result = await response.json();
      setRules(result.rules);
    }
    fetchRules();
  }, []);

  const handleOpen = (rule) => {
    setSelectedRule(rule);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="flex items-start p-8">
      <div className="flex flex-row gap-8">
        {rules.map((rule, idx) => (
          <Card
            key={idx}
            sx={{ width: 300 }}
          >
            <CardMedia
              component="img"
              image={rule["bg_image_url"]}
              alt={rule.name}
              height="200"
            />
            <CardHeader title={rule.name} />
            <CardContent>
              <Button
                disableElevation
                variant="contained"
                color="primary"
                onClick={() => handleOpen(rule)}
                size="small"

              >
                View
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          {selectedRule?.name}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <StreamingMarkup content={selectedRule?.content} speed={0} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            variant="contained"
            color="primary"
            disableElevation
            size="small"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
} 