
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MRRCalculator from "@/components/MRRCalculator";

const Index = () => {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center p-4 sm:p-8">
      <header className="w-full max-w-4xl mb-8 mt-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-900 tracking-tight">SaaS MRR Calculator</h1>
        <p className="text-neutral-600 mt-2">
          Calculate and visualize your SaaS Monthly Recurring Revenue projections
        </p>
      </header>
      
      <main className="w-full max-w-4xl">
        <Card className="shadow-md border-neutral-200">
          <CardHeader>
            <CardTitle className="text-center text-xl sm:text-2xl">
              12-Month MRR Projection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MRRCalculator />
          </CardContent>
        </Card>
        
        <footer className="mt-12 mb-6 text-sm text-center text-neutral-500">
          <p>Use this calculator for estimation purposes only. Actual results may vary.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
