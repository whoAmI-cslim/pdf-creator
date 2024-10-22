import { FileUpload } from '@/components/file-upload';
import { ModeToggle } from '@/components/mode-toggle';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <div className=" container mx-auto p-8 max-w-full">
        <div className="absolute right-4 top-4">
          <ModeToggle />
        </div>
        <div className="mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Financial Report Generator
            </h1>
            <p className="text-muted-foreground">
              Upload your Excel sheets to generate professional PDF reports
            </p>
          </div>
          <FileUpload />
        </div>
      </div>
    </main>
  );
}