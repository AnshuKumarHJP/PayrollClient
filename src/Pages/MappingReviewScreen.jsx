import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../Lib/card';
import { Button } from '../Lib/button';
import { Badge } from '../Lib/badge';

const MappingReviewScreen = () => {
  const mappings = [
    { field: 'Employee ID', column: 'A', status: 'Mapped' },
    { field: 'Name', column: 'B', status: 'Mapped' },
    { field: 'Salary', column: 'C', status: 'Unmapped' },
  ];

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Mapping Review Screen</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {mappings.map((m, index) => (
              <li key={index} className="flex justify-between items-center">
                <span>{m.field} → Column {m.column}</span>
                <Badge variant={m.status === 'Mapped' ? 'default' : 'destructive'}>{m.status}</Badge>
              </li>
            ))}
          </ul>
          <Button className="mt-4">Confirm Mapping</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default MappingReviewScreen;
