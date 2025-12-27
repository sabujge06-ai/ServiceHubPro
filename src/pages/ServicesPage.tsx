import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, Image, Video, Music, Code, Database,
  Cloud, Mail, MessageSquare, Share2
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const services = [
  {
    icon: FileText,
    title: "Document Processing",
    description: "Convert, edit, and process documents in various formats.",
    price: 5,
  },
  {
    icon: Image,
    title: "Image Services",
    description: "Image editing, conversion, and optimization tools.",
    price: 5,
  },
  {
    icon: Video,
    title: "Video Processing",
    description: "Video conversion, compression, and editing services.",
    price: 5,
  },
  {
    icon: Music,
    title: "Audio Services",
    description: "Audio conversion and processing solutions.",
    price: 5,
  },
  {
    icon: Code,
    title: "Code Tools",
    description: "Developer tools and code processing utilities.",
    price: 5,
  },
  {
    icon: Database,
    title: "Data Services",
    description: "Data processing and transformation tools.",
    price: 5,
  },
  {
    icon: Cloud,
    title: "Cloud Storage",
    description: "Secure cloud storage and file management.",
    price: 5,
  },
  {
    icon: Mail,
    title: "Email Services",
    description: "Email verification and marketing tools.",
    price: 5,
  },
  {
    icon: MessageSquare,
    title: "SMS Services",
    description: "SMS verification and messaging solutions.",
    price: 5,
  },
  {
    icon: Share2,
    title: "API Access",
    description: "Direct API access for developers.",
    price: 5,
  },
];

export const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">Our Services</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Premium Digital <span className="gradient-text">Services</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access a wide range of digital services at just ৳5 per use. Subscribe for unlimited access.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {services.map((service, index) => (
            <Card key={index} className="glass-card hover:scale-105 transition-transform duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                  <service.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">৳{service.price}</span>
                  <span className="text-sm text-muted-foreground">per use</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Card className="glass-card max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-muted-foreground mb-6">
                Create an account to access all services. Subscribe for unlimited usage!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/register">Create Account</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/pricing">View Plans</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};
