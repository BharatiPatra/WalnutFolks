import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ConfirmOverwriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  previousData: any;
}

export function ConfirmOverwriteDialog({
  open,
  onOpenChange,
  onConfirm,
  previousData,
}: ConfirmOverwriteDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Overwrite Previous Data?</AlertDialogTitle>
          <AlertDialogDescription>
            You have previously saved chart data for this email. Would you like to overwrite it
            with the new values?
          </AlertDialogDescription>
        </AlertDialogHeader>
        {previousData && (
          <div className="rounded-lg border bg-muted/50 p-4">
            <p className="text-sm font-medium mb-2">Previous Values:</p>
            <pre className="text-xs overflow-auto">
              {JSON.stringify(previousData, null, 2)}
            </pre>
          </div>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Overwrite</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
