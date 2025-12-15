import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../Lib/card';
import { Button } from '../Lib/button';
import { Textarea } from '../Lib/textarea';
import { Badge } from '../Lib/badge';
import { Alert, AlertDescription } from '../Lib/alert';
import { Loader2, CheckCircle, XCircle, ArrowLeft, User, FileText, Clock } from 'lucide-react';
import approveRejectService from '../../api/services/approveRejectService';
import { useToast } from '../Lib/use-toast';

const ApproveRejectScreen = () => {
  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Approve / Reject / Send Back Screen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p>Task details here...</p>
            <Textarea placeholder="Comments" />
            <div className="flex space-x-2">
              <Button variant="default">Approve</Button>
              <Button variant="destructive">Reject</Button>
              <Button variant="secondary">Send Back</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApproveRejectScreen;
