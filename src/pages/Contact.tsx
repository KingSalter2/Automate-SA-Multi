import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  MessageSquare,
  Building2,
  Share2
} from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Showroom",
      content: ["126 Rivonia Road", "Sandton, Johannesburg", "Gauteng"],
      link: "https://maps.google.com/?q=126+Rivonia+Road+Sandton"
    },
    {
      icon: Mail,
      title: "Email Us",
      content: ["rameez@ebmsandton.co.za"],
      link: "mailto:rameez@ebmsandton.co.za"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: ["087 008 2062"],
      link: "tel:0870082062"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-gradient opacity-60" />
        <div className="container mx-auto px-4 relative z-10 text-center space-y-6">
          <Badge variant="outline" className="px-4 py-2 text-sm border-primary/50 text-primary bg-primary/10">
            Get In Touch
          </Badge>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground">
            Contact <span className="text-primary">EB Motors</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about a vehicle or financing? Our team is here to help you every step of the way.
          </p>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {contactInfo.map((info, i) => (
            <a 
              key={i} 
              href={info.link} 
              target={info.icon === MapPin ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="h-full bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <info.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold font-display">{info.title}</h3>
                  <div className="space-y-1">
                    {info.content.map((line, j) => (
                      <p key={j} className="text-muted-foreground">{line}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* Form & Hours Section */}
      <section className="py-20 bg-secondary/30 border-y border-border/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl font-display font-bold">Send us a <span className="text-primary">Message</span></h2>
                <p className="text-muted-foreground">
                  Fill out the form below and one of our consultants will get back to you within 24 hours.
                </p>
              </div>

              <form className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <Input placeholder="John Doe" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <Input type="email" placeholder="john@example.com" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <Input type="tel" placeholder="087 008 2062" className="bg-background/50" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Subject</label>
                  <Input placeholder="Inquiry about..." className="bg-background/50" />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <label className="text-sm font-medium">Message</label>
                  <Textarea 
                    placeholder="How can we help you?" 
                    className="min-h-[150px] bg-background/50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Button className="w-full h-12 text-lg font-bold gap-2">
                    Send Message <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                  <Clock className="w-6 h-6 text-primary" />
                  Business Hours
                </h3>
                <div className="space-y-4">
                  {[
                    { days: "Monday - Friday", hours: "08:00 - 17:30" },
                    { days: "Saturday", hours: "08:00 - 13:00" },
                    { days: "Sunday & Public Holidays", hours: "Closed" }
                  ].map((time, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-card border border-border/50">
                      <span className="font-medium text-foreground">{time.days}</span>
                      <span className="text-primary font-bold">{time.hours}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-display font-bold flex items-center gap-3">
                  <Building2 className="w-6 h-6 text-primary" />
                  Our Presence
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  With a strong presence in the NW Province and Sandton, EB Motors has built 
                  a reputation for excellence over the past 20 years. We understand that 
                  purchasing a vehicle is a significant decision, and we're committed to 
                  making it as seamless as possible.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" className="gap-2">
                    <Share2 className="w-4 h-4" /> Share Location
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <MessageSquare className="w-4 h-4" /> WhatsApp Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="h-[400px] w-full bg-secondary/50 relative overflow-hidden">
        <iframe 
          width="100%" 
          height="100%" 
          id="gmap_canvas" 
          src="https://maps.google.com/maps?q=126+Rivonia+Road,+Sandton,+Johannesburg,+Gauteng&t=&z=15&ie=UTF8&iwloc=&output=embed" 
          frameBorder="0" 
          scrolling="no" 
          marginHeight={0} 
          marginWidth={0}
          title="Location Map"
          className="w-full h-full filter grayscale-[0.8] invert-[0.9] contrast-[0.9] opacity-80 hover:opacity-100 transition-all duration-500"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
        />
        {/* Overlay to match theme */}
        <div className="absolute inset-0 bg-primary/10 pointer-events-none mix-blend-overlay" />
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
