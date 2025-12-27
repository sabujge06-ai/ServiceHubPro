import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Target, Award, Heart } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description: "To provide accessible and reliable digital services that empower individuals and businesses to thrive in the digital age.",
  },
  {
    icon: Users,
    title: "Our Team",
    description: "A dedicated team of professionals committed to delivering exceptional service and support to our users.",
  },
  {
    icon: Award,
    title: "Quality First",
    description: "We prioritize quality in everything we do, ensuring our services meet the highest standards of excellence.",
  },
  {
    icon: Heart,
    title: "Customer Focus",
    description: "Your success is our success. We're dedicated to understanding and meeting your unique needs.",
  },
];

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Building the Future of <span className="gradient-text">Digital Services</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We're on a mission to make premium digital services accessible to everyone.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <Card className="glass-card">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-muted-foreground mb-4">
                Founded with a vision to democratize access to digital services, ServiceHub has grown 
                from a small startup to a trusted platform serving thousands of users across Bangladesh.
              </p>
              <p className="text-muted-foreground mb-4">
                We understand the challenges faced by individuals and businesses in accessing quality 
                digital services. That's why we've built a platform that combines affordability with 
                excellence, ensuring everyone can benefit from the digital revolution.
              </p>
              <p className="text-muted-foreground">
                Today, we continue to innovate and expand our offerings, always keeping our users' 
                needs at the heart of everything we do.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {values.map((value, index) => (
            <Card key={index} className="glass-card hover:scale-105 transition-transform duration-300">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
