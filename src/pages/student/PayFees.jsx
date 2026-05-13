import { Button, Card, CardContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFees, payFees } from "../../api/feesApi";

const PayFees = () => {
  const [fees, setFees] = useState([]);

  useEffect(() => {
    getFees().then(res => setFees(res.data));
  }, []);

  return (
    <div>
      {fees.map(f => (
        <Card key={f.id} sx={{ margin: 2 }}>
          <CardContent>
            <Typography>Amount: {f.amount}</Typography>
            <Typography>Status: {f.status}</Typography>

            {f.status !== "paid" && (
              <Button variant="contained"
                onClick={() => payFees({ feeId: f.id })}>
                Pay Now
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PayFees;