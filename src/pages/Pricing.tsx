import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, Star, Crown, Rocket, Diamond } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const plans = [
  {
    name: "Brins",
    duration: "30 days",
    price: 299,
    icon: Zap,
    features: ["Basic service access", "Email support", "30 days validity"],
    popular: false,
  },
  {
    name: "Starter",
    duration: "7 days",
    price: 99,
    icon: Star,
    features: ["All basic features", "7 days trial", "Quick start"],
    popular: false,
  },
  {
    name: "Basic",
    duration: "15 days",
    price: 149,
    icon: Crown,
    features: ["Extended access", "Priority support", "15 days validity"],
    popular: true,
  },
  {
    name: "Advanced",
    duration: "45 days",
    price: 399,
    icon: Rocket,
    features: ["All features", "Premium support", "45 days validity"],
    popular: false,
  },
  {
    name: "Pro",
    duration: "60 days",
    price: 499,
    icon: Diamond,
    features: ["Everything in Advanced", "Dedicated support", "60 days validity"],
    popular: false,
  },
  {
    name: "Ultimate",
    duration: "90 days",
    price: 699,
    icon: Diamond,
    features: ["Full platform access", "VIP support", "90 days validity", "Custom features"],
    popular: false,
  },
];

export const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Pricing</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="gradient-text">Perfect Plan</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Flexible subscription plans designed to fit your needs. Start with any plan and upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <Card 
              key={plan.name} 
              className={`relative glass-card hover:scale-105 transition-transform duration-300 ${
                plan.popular ? "border-primary shadow-lg shadow-primary/20" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  Most Popular
                </Badge>
              )}
              <CardHeader className="text-center pb-2">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <plan.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.duration}</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="mb-6">
                  <span className="text-4xl font-bold">৳{plan.price}</span>
                </div>
                <ul className="space-y-3 mb-6 text-left">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className="w-full" variant={plan.popular ? "default" : "outline"}>
                  <Link to="/register">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
